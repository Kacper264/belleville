// Wszystkie dane specyficzne dla parafii są zebrane w tym pliku.
// Aby dostosować stronę do innej parafii polskiej we Francji,
// wystarczy zmienić wartości poniżej — reszta aplikacji się nie zmienia.

export const parafia = {
  nazwa: 'Polska Parafia na Bellevillu',
  wezwanie: 'Kaplica Matki Bożej z Bellevillu — Królowej Rodzin',
  miasto: 'Paryż',
  kraj: 'Francja',
  zgromadzenie:
    'Duszpasterstwo polonijne w XIX dzielnicy Paryża, prowadzone w ramach Polskiej Misji Katolickiej we Francji.',
  adres: {
    kosciol: 'Kaplica Matki Bożej z Bellevillu',
    ulica: '5 Allée Gabrielle d’Estrées (wejście od 3 rue Rampal)',
    kodMiasto: '75019 Paryż',
    uwaga:
      'Wejście do kaplicy prowadzi od strony rue Rampal — sprawdź bieżące ogłoszenia w razie zmian.',
  },
  mapa: {
    embedSrc:
      'https://www.google.com/maps?q=5+Allee+Gabrielle+dEstrees+75019+Paris&output=embed',
    link: 'https://www.google.com/maps?q=5+Allee+Gabrielle+dEstrees+75019+Paris',
  },
  kontakt: {
    telefon: '+33 7 66 03 72 72',
    email: 'parafiabelleville@gmail.com',
  },
  proboszcz: 'ks. Mateusz Chejzdral',
  mszeSwiete: [
    { dzien: 'Niedziela i święta', godzina: '09:00 i 11:30', miejsce: 'Kaplica Matki Bożej z Bellevillu', uwaga: 'Msze po polsku' },
    { dzien: 'Środa', godzina: '19:00', miejsce: 'Kaplica Matki Bożej z Bellevillu', uwaga: '' },
    { dzien: 'Piątek', godzina: '19:00', miejsce: 'Kaplica Matki Bożej z Bellevillu', uwaga: '' },
    { dzien: 'Sobota', godzina: '18:00', miejsce: 'Kaplica Matki Bożej z Bellevillu', uwaga: '' },
  ],
  historiaBudynku: [
    {
      okres: 'Powstanie',
      tekst:
        'Kaplica Matki Bożej z Bellevillu ma dwie historie: historię budynku jako miejsca modlitwy oraz historię ludzi, którzy się w nim gromadzą.',
    },
    {
      okres: '2010',
      tekst:
        'Dzieje kaplicy — jej powstanie, zagubienie i odnalezienie — opisano w artykule „Zapomniana Kaplica”, opublikowanym w lipcu 2010 r. w „Głosie Katolickim”.',
    },
    {
      okres: 'Dziś',
      tekst:
        'Kaplica gości cotygodniową wspólnotę polską Bellevillu — Mszę Świętą, grupę muzyczną animującą liturgię oraz Teatr Bellevillski.',
    },
  ],
  historiaWspolnoty:
    'Polska Misja Katolicka towarzyszy Polakom we Francji od dziesięcioleci. Na Bellevillu wspólnota gromadzi się w kaplicy Matki Bożej Królowej Rodzin na Mszy Świętej w języku polskim, spotkaniach Rady duszpasterskiej oraz cotygodniowych próbach Grupy Muzycznej, przygotowującej oprawę muzyczną liturgii.',
  sakramenty: [
    {
      nazwa: 'Chrzest święty',
      opis:
        'Zgłoszenia przyjmowane są co najmniej miesiąc przed planowaną datą. Rodzice i chrzestni proszeni są o kontakt z kancelarią w celu ustalenia terminu spotkania przygotowawczego.',
    },
    {
      nazwa: 'Pierwsza Komunia Święta',
      opis:
        'Przygotowanie odbywa się w ramach cotygodniowej katechezy w roku szkolnym. Zapisy dzieci przyjmowane są na początku roku katechetycznego.',
    },
    {
      nazwa: 'Bierzmowanie',
      opis:
        'Kandydaci zgłaszają się poprzez kartę zgłoszeniową dostępną w kancelarii. Spotkania formacyjne odbywają się cyklicznie — szczegóły w ogłoszeniach.',
    },
    {
      nazwa: 'Sakrament małżeństwa',
      opis:
        'Prosimy o kontakt z kancelarią co najmniej trzy miesiące przed planowaną datą ślubu, aby ustalić formalności i spotkania przygotowawcze.',
    },
    {
      nazwa: 'Spowiedź',
      opis: 'Możliwość spowiedzi przed każdą Mszą Świętą — szczegóły u księdza.',
    },
  ],
  ogloszeniaUwaga:
    'Ogłoszenia poniżej są zarządzane z panelu administracyjnego (/admin) i zapisywane w bazie danych.',
  nawigacja: [
    { do: '/', etykieta: 'Strona główna' },
    { do: '/historia', etykieta: 'Historia' },
    { do: '/sakramenty', etykieta: 'Msze i sakramenty' },
    { do: '/ogloszenia', etykieta: 'Ogłoszenia' },
    { do: '/kontakt', etykieta: 'Kontakt' },
  ],
};
