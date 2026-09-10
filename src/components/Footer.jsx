import { parafia } from '../data/parafia.js';
import ArchMotif from './ArchMotif.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <ArchMotif className="site-footer__motif" count={8} />
      <div className="container site-footer__row">
        <div>
          <p className="site-footer__title">{parafia.nazwa}</p>
          <p className="site-footer__line">
            {parafia.adres.kosciol}, {parafia.adres.ulica}, {parafia.adres.kodMiasto}
          </p>
        </div>
        <div>
          <p className="site-footer__line">{parafia.kontakt.telefon}</p>
          <p className="site-footer__line">
            <a href={`mailto:${parafia.kontakt.email}`}>{parafia.kontakt.email}</a>
          </p>
        </div>
      </div>
      <p className="site-footer__note container">
        Strona przygotowana dla wspólnoty polskiej w {parafia.miasto}. Treści przykładowe do uzupełnienia przez
        kancelarię parafialną.
      </p>
    </footer>
  );
}
