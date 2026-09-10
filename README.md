# Polska Parafia na Bellevillu — strona parafialna

Strona typu SPA (React + React Router), zbudowana jako alternatywna wersja
strony wzorowanej na aulnaysousbois.pl, dla parafii polskiej na Bellevillu w Paryżu.

## Uruchomienie lokalne

Za pomocą `make` (patrz `make help` na pełną listę komend):

```bash
make install
make dev
```

Albo bezpośrednio przez npm:

```bash
npm install
npm run dev
```

Strona będzie dostępna pod http://localhost:5173

## Build produkcyjny

```bash
make build
# lub: npm run build
```

Pliki gotowe do wdrożenia trafiają do folderu `dist/`. `make preview`
buduje i serwuje ten folder lokalnie, żeby sprawdzić build przed wysłaniem.

## Deploy na Netlify przez make (opcjonalnie)

Wymaga jednorazowego zalogowania przez `netlify-cli` (instalowane on-the-fly
przez `npx`, nic nie trzeba instalować globalnie):

```bash
make netlify-login   # jednorazowo, otwiera przeglądarkę
make netlify-init    # łączy ten folder z istniejącą stroną Netlify (lub tworzy nową)
make deploy-preview   # deploy na tymczasowy URL podglądu
make deploy           # deploy na produkcję
```

## Struktura

- `src/data/parafia.js` — **plik do zmiany, aby dostosować stronę do
  innej parafii**: nazwa, adres, kontakt, godziny Mszy, sakramenty,
  historia, linki nawigacji.
- `supabase/schema.sql` — schemat bazy danych (tabela `ogloszenia` +
  reguły bezpieczeństwa) do uruchomienia raz w Supabase.
- `src/lib/supabase.js` — klient Supabase (czyta zmienne środowiskowe).
- `src/hooks/` — `useOgloszenia` (odczyt publiczny), `useAuth` (sesja
  administratora).
- `src/pages/` — Strona główna, Historia, Msze i sakramenty, Ogłoszenia,
  Kontakt, oraz `Admin` (`/admin`, chroniona logowaniem).
- `src/components/` — nagłówek, stopka, tabela godzin Mszy, formularz
  logowania, motyw graficzny (łuki gotyckie).

## Wdrożenie na Netlify

**Opcja A — bez Gita (najszybsza):**
1. `make build`
2. Wejdź na https://app.netlify.com/drop
3. Przeciągnij folder `dist/` na stronę.

**Opcja B — z repozytorium Git (zalecana, z automatycznym redeployem):**
1. Wypchnij ten projekt na GitHub/GitLab.
2. Na Netlify: "Add new site" → "Import an existing project".
3. Netlify wykryje `netlify.toml` (build command `npm run build`,
   publish dir `dist`, Node 20 przez `NODE_VERSION`) — nic nie trzeba
   zmieniać ręcznie.

**Opcja C — z CLI (`make deploy` / `make deploy-preview`):** patrz sekcja
wyżej „Deploy na Netlify przez make”.

## Baza danych — ogłoszenia (Supabase)

Ogłoszenia są przechowywane w bazie Postgres na Supabase (darmowy plan) i
zarządzane z panelu `/admin` chronionego hasłem — nie trzeba edytować kodu
ani robić redeployu, żeby dodać nowe ogłoszenie.

**1. Utwórz projekt Supabase**
1. Załóż darmowe konto na https://supabase.com i utwórz nowy projekt.
2. W Dashboard → *Project Settings* → *API* skopiuj `Project URL` oraz
   klucz `anon public`.

**2. Utwórz tabelę**
1. W Dashboard → *SQL Editor* → *New query*.
2. Wklej całą zawartość pliku `supabase/schema.sql` z tego repo i uruchom
   (`Run`). Tworzy to tabelę `ogloszenia`, reguły bezpieczeństwa (RLS) oraz
   dwa przykładowe wpisy.

**3. Utwórz konto administratora**
1. W Dashboard → *Authentication* → *Users* → *Add user*.
2. Podaj e-mail i hasło, którymi będziesz się logować na `/admin`.
   (Rejestracja jest wyłączona — tylko Ty tworzysz konta z Dashboardu.)

**4. Podłącz zmienne środowiskowe**

Lokalnie:
```bash
cp .env.example .env
# uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY
```

Na Netlify: *Site configuration* → *Environment variables* → dodaj te same
dwie zmienne (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), potem zrób
redeploy, żeby build je uwzględnił.

**5. Gotowe** — wejdź na `/admin`, zaloguj się utworzonym kontem i
dodawaj/edytuj/usuwaj ogłoszenia. Strona publiczna (`/` i `/ogloszenia`)
pokazuje tylko te oznaczone jako „widoczne na stronie”.

Klucz `anon` jest bezpieczny do umieszczenia w kodzie frontendu — reguły
RLS w bazie pilnują, że niezalogowani widzą tylko opublikowane ogłoszenia,
a zapis wymaga zalogowania.

## Formularz kontaktowy (Netlify Forms)

Formularz w `/kontakt` jest już skonfigurowany pod Netlify Forms
(pole ukryte w `index.html` pozwala Netlify wykryć formularz podczas
builda). Po wdrożeniu, zgłoszenia pojawią się w panelu Netlify:
Site → Forms. Nie wymaga żadnego backendu ani klucza API.

## Treści przykładowe

Godziny Mszy, ogłoszenia i część opisu historii mają charakter
przykładowy/orientacyjny (na podstawie publicznie dostępnych informacji).
Przed publikacją warto je zweryfikować i zaktualizować z kancelarią
parafialną, edytując `src/data/parafia.js`.
