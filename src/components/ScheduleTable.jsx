import { parafia } from '../data/parafia.js';
import './ScheduleTable.css';

export default function ScheduleTable() {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th scope="col">Kiedy</th>
          <th scope="col">Godzina</th>
          <th scope="col">Miejsce</th>
        </tr>
      </thead>
      <tbody>
        {parafia.mszeSwiete.map((msza) => (
          <tr key={msza.dzien}>
            <th scope="row">{msza.dzien}</th>
            <td>{msza.godzina}</td>
            <td>
              {msza.miejsce}
              {msza.uwaga && <span className="schedule-table__note"> — {msza.uwaga}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
