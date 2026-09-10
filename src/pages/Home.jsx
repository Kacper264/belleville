import { Link } from 'react-router-dom';
import { parafia } from '../data/parafia.js';
import { useOgloszenia } from '../hooks/useOgloszenia.js';
import ArchMotif from '../components/ArchMotif.jsx';
import ScheduleTable from '../components/ScheduleTable.jsx';
import './Home.css';

export default function Home() {
  const { ogloszenia, loading } = useOgloszenia(1);
  const ostatnieOgloszenie = ogloszenia[0];

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow-note">{parafia.miasto}, {parafia.kraj}</p>
            <h1 className="hero__title">{parafia.nazwa}</h1>
            <p className="hero__lead">{parafia.wezwanie}. {parafia.zgromadzenie}</p>
            <div className="hero__actions">
              <Link className="btn btn-solid" to="/sakramenty">Godziny Mszy i sakramenty</Link>
              <Link className="btn" to="/kontakt">Kontakt z kancelarią</Link>
            </div>
          </div>
          <ArchMotif className="hero__motif" count={3} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Najbliższe Msze Święte</h2>
          <p className="section-lead">
            {parafia.adres.kosciol}, {parafia.adres.ulica}, {parafia.adres.kodMiasto}
          </p>
          <ScheduleTable />
          <p className="eyebrow-note" style={{ marginTop: 16 }}>{parafia.adres.uwaga}</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container two-col">
          <div>
            <h2 className="section-title">Życie wspólnoty</h2>
            <p>{parafia.historiaWspolnoty}</p>
            <Link className="btn" to="/historia">Poznaj historię parafii</Link>
          </div>
          <div>
            <h2 className="section-title">Ostatnie ogłoszenie</h2>
            {loading && <p className="eyebrow-note">Wczytywanie…</p>}
            {!loading && !ostatnieOgloszenie && (
              <p className="eyebrow-note">Brak aktualnych ogłoszeń.</p>
            )}
            {ostatnieOgloszenie && (
              <article className="announcement-card">
                <p className="announcement-card__date">
                  {new Date(ostatnieOgloszenie.data_publikacji).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h3>{ostatnieOgloszenie.tytul}</h3>
                <p>{ostatnieOgloszenie.tresc}</p>
              </article>
            )}
            <Link className="btn" to="/ogloszenia">Wszystkie ogłoszenia</Link>
          </div>
        </div>
      </section>
    </>
  );
}
