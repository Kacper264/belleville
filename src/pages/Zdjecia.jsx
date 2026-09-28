import { useEffect, useState } from 'react';
import { listPhotoGroups } from '../lib/photoStorage.js';
import './Zdjecia.css';

export default function Zdjecia() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchZdjecia() {
      const { groups: loadedGroups, error: fetchError } = await listPhotoGroups();

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setGroups(loadedGroups);
      }
      setLoading(false);
    }

    fetchZdjecia();
    return () => {
      active = false;
    };
  }, []);

  const visibleGroups = selectedGroup === 'all'
    ? groups
    : groups.filter((group) => group.name === selectedGroup);
  const zdjecia = visibleGroups.flatMap((group) =>
    group.photos.map((photo) => ({ ...photo, groupLabel: group.label })),
  );

  return (
    <div className="container page zdjecia-page">
      <h1 className="page__title">Zdjęcia</h1>

      {loading && <p className="eyebrow-note">Wczytywanie zdjęć…</p>}
      {error && <p className="zdjecia-state zdjecia-state--error">Nie udało się wczytać zdjęć ({error}).</p>}
      {!loading && !error && groups.length > 0 && (
        <div className="zdjecia-filters" aria-label="Filtrer par groupe">
          <button
            className={`zdjecia-filters__button ${selectedGroup === 'all' ? 'is-active' : ''}`}
            onClick={() => setSelectedGroup('all')}
            type="button"
          >
            Wszystkie
          </button>
          {groups.map((group) => (
            <button
              className={`zdjecia-filters__button ${selectedGroup === group.name ? 'is-active' : ''}`}
              key={group.name || 'ungrouped'}
              onClick={() => setSelectedGroup(group.name)}
              type="button"
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
      {!loading && !error && zdjecia.length === 0 && (
        <p className="eyebrow-note">Brak zdjęć w galerii.</p>
      )}

      {!loading && !error && zdjecia.length > 0 && (
        <div className="zdjecia-grid">
          {zdjecia.map((zdjecie) => (
            <a
              className="zdjecia-grid__item"
              href={zdjecie.url}
              key={zdjecie.path}
              target="_blank"
              rel="noreferrer"
              aria-label={`Otwórz zdjęcie z grupy ${zdjecie.groupLabel} w pełnym rozmiarze`}
            >
              <img src={zdjecie.url} alt="Zdjęcie z galerii parafialnej" loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}