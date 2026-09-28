-- Migration : ajout du support des images sur les ogłoszenia.
-- À exécuter une fois dans Supabase → SQL Editor → New query → Run.

-- 1. Colonne pour l'URL publique de l'image
alter table ogloszenia
  add column if not exists zdjecie_url text;

-- 2. Bucket de stockage public pour les images des ogłoszenia
insert into storage.buckets (id, name, public)
values ('zdjecia', 'zdjecia', true)
on conflict (id) do nothing;

-- 3. Règles d'accès au bucket : lecture publique, écriture réservée à l'admin connecté
drop policy if exists "Public: lecture des zdjęć ogłoszeń" on storage.objects;
create policy "Public: lecture des zdjęć ogłoszeń"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'zdjecia');

drop policy if exists "Admin: dodawanie zdjęć" on storage.objects;
create policy "Admin: dodawanie zdjęć"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'zdjecia');

drop policy if exists "Admin: aktualizacja zdjęć" on storage.objects;
create policy "Admin: aktualizacja zdjęć"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'zdjecia')
  with check (bucket_id = 'zdjecia');

drop policy if exists "Admin: usuwanie zdjęć" on storage.objects;
create policy "Admin: usuwanie zdjęć"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'zdjecia');