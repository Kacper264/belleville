import { Link } from 'react-router-dom';
import { parafia } from '../data/parafia.js';
import { useOgloszenia } from '../hooks/useOgloszenia.js';
import ScheduleTable from '../components/ScheduleTable.jsx';
import './Home.css';

const HOME_OGLOSZENIE_EXCERPT_LENGTH = 180;
const facebookPageUrl = import.meta.env.VITE_FACEBOOK_PAGE_URL?.trim();
const facebookEmbedUrl = "https://www.facebook.com/ParafiaBelleville?locale=fr_FR"
  ? `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
      href: facebookPageUrl,
      tabs: 'timeline',
      width: '500',
      height: '650',
      small_header: 'true',
      adapt_container_width: 'true',
      hide_cover: 'false',
      show_facepile: 'false',
    }).toString()}`
  : null;

export default function Home() {
  const { ogloszenia, loading } = useOgloszenia(1);
  const ostatnieOgloszenie = ogloszenia[0];
  const trescOgloszenia = ostatnieOgloszenie?.tresc ?? '';
  const skroconaTresc = trescOgloszenia.length > HOME_OGLOSZENIE_EXCERPT_LENGTH
    ? `${trescOgloszenia.slice(0, HOME_OGLOSZENIE_EXCERPT_LENGTH).trimEnd()}…`
    : trescOgloszenia;

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <img
              className="hero__brand"
              src="/hero.png"
              alt={`${parafia.nazwa} — ${parafia.wezwanie}`}
            />
            <p className="hero__lead">{parafia.zgromadzenie}</p>
            <div className="hero__actions">
              <Link className="btn btn-solid" to="/sakramenty">Godziny Mszy i sakramenty</Link>
              <Link className="btn" to="/kontakt">Kontakt z kancelarią</Link>
            </div>
          </div>
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

                {ostatnieOgloszenie.zdjecie_url && (
                  <img
                    className="announcement-card__zdjecie"
                    src={ostatnieOgloszenie.zdjecie_url}
                    alt={ostatnieOgloszenie.tytul}
                    loading="lazy"
                  />
                )}
                <h3>{ostatnieOgloszenie.tytul}</h3>
                <p>{skroconaTresc}</p>
              </article>
            )}
            <Link className="btn" to="/ogloszenia">Wszystkie ogłoszenia</Link>
          </div>
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

      <section className="section section-alt facebook-feed">
        <div className="container facebook-feed__layout">
          <div className="facebook-feed__intro">
            <div className="facebook-feed__brand" aria-hidden="true">f</div>
            <p className="eyebrow-note">Nasza wspólnota online</p>
            <h2 className="section-title">Bądźmy w kontakcie</h2>
            <p className="facebook-feed__copy">
              Zobacz, co dzieje się w parafii. Publikujemy aktualności, zdjęcia i ważne informacje.
            </p>
            {facebookPageUrl ? (
              <a className="btn btn-solid" href={facebookPageUrl} target="_blank" rel="noreferrer">
                Odwiedź nas na Facebooku <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="eyebrow-note facebook-feed__notice">
                Dodaj adres publicznej strony parafii w ustawieniu VITE_FACEBOOK_PAGE_URL.
              </p>
            )}
          </div>
          <div className="facebook-feed__content">
            <div className="facebook-feed__topline">
              <h3>Najnowsze wpisy</h3>
              <span>FACEBOOK</span>
            </div>
            {facebookEmbedUrl ? (
              <div className="facebook-feed__frame">
                <iframe
                  title="Najnowsze wpisy parafii na Facebooku"
                  src={facebookEmbedUrl}
                  loading="lazy"
                  scrolling="no"
                  allow="encrypted-media; clipboard-write;"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className="facebook-feed__placeholder" aria-hidden="true">
                <span className="facebook-feed__placeholder-mark">f</span>
                <span>Wpisy parafialne</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
