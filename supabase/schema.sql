-- À exécuter une fois dans Supabase : Dashboard → SQL Editor → New query → coller → Run.

create extension if not exists "pgcrypto";

create table if not exists ogloszenia (
  id uuid primary key default gen_random_uuid(),
  tytul text not null,
  tresc text not null,
  data_publikacji date not null default current_date,
  opublikowane boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Maintient updated_at à jour automatiquement à chaque modification
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ogloszenia_updated_at on ogloszenia;
create trigger trg_ogloszenia_updated_at
  before update on ogloszenia
  for each row
  execute function set_updated_at();

-- Row Level Security : lecture publique des annonces publiées,
-- écriture réservée aux utilisateurs authentifiés (l'admin du site).
alter table ogloszenia enable row level security;

drop policy if exists "Public: lecture des ogloszenia publiées" on ogloszenia;
create policy "Public: lecture des ogloszenia publiées"
  on ogloszenia for select
  to anon, authenticated
  using (opublikowane = true);

drop policy if exists "Admin: lecture de tout (y compris brouillons)" on ogloszenia;
create policy "Admin: lecture de tout (y compris brouillons)"
  on ogloszenia for select
  to authenticated
  using (true);

drop policy if exists "Admin: création" on ogloszenia;
create policy "Admin: création"
  on ogloszenia for insert
  to authenticated
  with check (true);

drop policy if exists "Admin: modification" on ogloszenia;
create policy "Admin: modification"
  on ogloszenia for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin: suppression" on ogloszenia;
create policy "Admin: suppression"
  on ogloszenia for delete
  to authenticated
  using (true);

-- Quelques annonces de départ (à supprimer/éditer depuis /admin une fois connecté)
insert into ogloszenia (tytul, tresc, data_publikacji) values
  ('Próby Grupy Muzycznej', 'W każdy piątek około godz. 20:00 spotyka się nasza Grupa Muzyczna, przygotowująca animację Mszy Świętej.', current_date),
  ('Spotkanie Rady duszpasterskiej', 'Zapraszamy na spotkanie Rady duszpasterskiej po Mszy Świętej o godzinie 11:00.', current_date - 7);
