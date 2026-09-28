import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { listPhotoGroups, PHOTO_BUCKET } from '../lib/photoStorage.js';
import './AdminGaleria.css';

export default function AdminGaleria() {
  const [groups, setGroups] = useState([]);
  const [files, setFiles] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const fileInput = useRef(null);

  async function refreshPhotos() {
    setLoading(true);
    const { groups: loadedGroups, error: listError } = await listPhotoGroups();

    if (listError) {
      setError(listError.message);
    } else {
      setGroups(loadedGroups);
    }
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    listPhotoGroups().then(({ groups: loadedGroups, error: listError }) => {
      if (!active) return;
      if (listError) setError(listError.message);
      else setGroups(loadedGroups);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files ?? []);
    setFiles(selectedFiles.filter((file) => file.type.startsWith('image/')));
    setError(null);
    setMessage('');
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setMessage('');
    let uploadedCount = 0;
    const folder = groupName.trim().replace(/[\\/]/g, '-').replace(/\s+/g, '-');

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${crypto.randomUUID()}.${extension}`;
      const path = folder ? `${folder}/${filename}` : filename;
      const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        break;
      }
      uploadedCount += 1;
    }

    setFiles([]);
    if (fileInput.current) fileInput.current.value = '';
    if (uploadedCount > 0) {
      setMessage(`${uploadedCount} zdjęć dodano do galerii.`);
      setSelectedGroup(folder || 'all');
      await refreshPhotos();
    }
    setUploading(false);
  }

  async function handleDelete(photo) {
    if (!window.confirm('Usunąć to zdjęcie z galerii?')) return;

    setError(null);
    const { error: deleteError } = await supabase.storage.from(PHOTO_BUCKET).remove([photo.path]);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await refreshPhotos();
  }

  const allPhotos = groups.flatMap((group) =>
    group.photos.map((photo) => ({ ...photo, groupName: group.name, groupLabel: group.label })),
  );
  const visiblePhotos = selectedGroup === 'all'
    ? allPhotos
    : allPhotos.filter((photo) => photo.groupName === selectedGroup);

  return (
    <section className="admin-gallery" aria-labelledby="admin-gallery-title">
      <h2 className="page__subtitle" id="admin-gallery-title">Galeria zdjęć</h2>

      <form className="admin-gallery__upload" onSubmit={handleUpload}>
        <label className="kontakt-form__field">
          Groupe
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            list="admin-gallery-groups"
            placeholder="Ex. 2026"
          />
          <datalist id="admin-gallery-groups">
            {groups.filter((group) => group.name).map((group) => (
              <option key={group.name} value={group.name} />
            ))}
          </datalist>
        </label>
        <label className="kontakt-form__field">
          Dodaj zdjęcia
          <input
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={fileInput}
            type="file"
          />
        </label>
        {files.length > 0 && <p className="eyebrow-note">Wybrano zdjęć: {files.length}</p>}
        <button className="btn btn-solid" disabled={uploading || files.length === 0} type="submit">
          {uploading ? 'Dodawanie…' : 'Dodaj do galerii'}
        </button>
      </form>

      {error && <p className="admin-gallery__error" role="alert">{error}</p>}
      {message && <p className="admin-gallery__message" role="status">{message}</p>}
      {loading && <p className="eyebrow-note">Wczytywanie zdjęć…</p>}
      {!loading && allPhotos.length > 0 && (
        <div className="admin-gallery__filters" aria-label="Filtrer par groupe">
          <button
            className={`admin-gallery__filter ${selectedGroup === 'all' ? 'is-active' : ''}`}
            onClick={() => setSelectedGroup('all')}
            type="button"
          >
            Tous les groupes
          </button>
          {groups.map((group) => (
            <button
              className={`admin-gallery__filter ${selectedGroup === group.name ? 'is-active' : ''}`}
              key={group.name || 'ungrouped'}
              onClick={() => setSelectedGroup(group.name)}
              type="button"
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
      {!loading && allPhotos.length === 0 && !error && (
        <p className="eyebrow-note">Galeria jest pusta.</p>
      )}

      {!loading && visiblePhotos.length > 0 && (
        <div className="admin-gallery__grid">
          {visiblePhotos.map((photo) => (
            <article className="admin-gallery__item" key={photo.path}>
              <img src={photo.url} alt="Zdjęcie w galerii" loading="lazy" />
              <p>{photo.groupLabel}</p>
              <button className="btn" onClick={() => handleDelete(photo)} type="button">
                Usuń
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}