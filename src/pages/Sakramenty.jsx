import { parafia } from '../data/parafia.js';
import ScheduleTable from '../components/ScheduleTable.jsx';
import './Sakramenty.css';

export default function Sakramenty() {
  return (
    <div className="container page">
      <h1 className="page__title">Msze i sakramenty</h1>

      <h2 className="page__subtitle">Godziny Mszy Świętych</h2>
      <ScheduleTable />
      <p className="eyebrow-note" style={{ marginTop: 16 }}>{parafia.adres.uwaga}</p>

      <h2 className="page__subtitle">Sakramenty</h2>
      <div className="sacrament-list">
        {parafia.sakramenty.map((s) => (
          <article key={s.nazwa} className="sacrament-item">
            <h3>{s.nazwa}</h3>
            <p>{s.opis}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
