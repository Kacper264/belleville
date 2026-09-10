import { parafia } from '../data/parafia.js';
import './Historia.css';

export default function Historia() {
  return (
    <div className="container page">
      <h1 className="page__title">Historia</h1>
      <p className="section-lead">
        Dzieje kościoła {parafia.adres.kosciol} oraz wspólnoty polskiej, która się w nim gromadzi.
      </p>

      <h2 className="page__subtitle">Wspólnota polska</h2>
      <p>{parafia.historiaWspolnoty}</p>

      <h2 className="page__subtitle">Kościół {parafia.adres.kosciol}</h2>
      <ol className="timeline">
        {parafia.historiaBudynku.map((etap) => (
          <li key={etap.okres} className="timeline__item">
            <span className="timeline__okres">{etap.okres}</span>
            <p>{etap.tekst}</p>
          </li>
        ))}
      </ol>

      <p className="eyebrow-note">
        Szczegóły historyczne warto uzupełnić wspomnieniami parafian i archiwum kancelarii — powyższy zarys
        opiera się na ogólnodostępnych informacjach o budynku kościoła.
      </p>
    </div>
  );
}
