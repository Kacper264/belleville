import { useOgloszenia } from '../hooks/useOgloszenia.js';
import { parafia } from '../data/parafia.js';
import './Ogloszenia.css';

export default function Ogloszenia() {
  const { ogloszenia, loading, error } = useOgloszenia();

  return (
    <div className="container page">
      <h1 className="page__title">Ogłoszenia parafialne</h1>

      {loading && <p className="eyebrow-note">Wczytywanie ogłoszeń…</p>}

      {error && (
        <p className="ogloszenie__error">
          Nie udało się wczytać ogłoszeń ({error}). Spróbuj odświeżyć stronę.
        </p>
      )}

      {!loading && !error && ogloszenia.length === 0 && (
        <p className="eyebrow-note">Brak aktualnych ogłoszeń.</p>
      )}

      <div className="ogloszenia-list">
        {ogloszenia.map((o) => (
          <article key={o.id} className="ogloszenie">
            <p className="ogloszenie__data">
              {new Date(o.data_publikacji).toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {o.zdjecie_url && (
              <img className="ogloszenie__zdjecie" src={o.zdjecie_url} alt={o.tytul} loading="lazy" />
            )}
            <h2>{o.tytul}</h2>
            <p>{o.tresc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
