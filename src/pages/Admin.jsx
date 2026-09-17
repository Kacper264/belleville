import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.js';
import LoginForm from '../components/LoginForm.jsx';
import './Admin.css';

const BUCKET = 'ogloszenia-zdjecia';
const PUSTY_FORMULARZ = {
  id: null,
  tytul: '',
  tresc: '',
  data_publikacji: '',
  opublikowane: true,
  zdjecie_url: null,
};

function sciezkaZUrl(url) {
  const marker = `/${BUCKET}/`;
  const idx = url?.indexOf(marker) ?? -1;
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export default function Admin() {
  const { session, loading: authLoading } = useAuth();

  if (authLoading) return <div className="container page">Wczytywanie…</div>;
  if (!session) return <div className="container page"><LoginForm /></div>;

  return (
    <div className="container page">
      <AdminPanel />
    </div>
  );
}

function AdminPanel() {
  const [ogloszenia, setOgloszenia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(dzisiajFormularz());
  const [plik, setPlik] = useState(null);
  const [podglad, setPodglad] = useState(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('ogloszenia')
      .select('*')
      .order('data_publikacji', { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setOgloszenia(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: fetchError } = await supabase
        .from('ogloszenia')
        .select('*')
        .order('data_publikacji', { ascending: false });
      if (!active) return;
      if (fetchError) setError(fetchError.message);
      else setOgloszenia(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  function dzisiajFormularz() {
    return { ...PUSTY_FORMULARZ, data_publikacji: new Date().toISOString().slice(0, 10) };
  }

  function resetujFormularz() {
    setForm(dzisiajFormularz());
    setPlik(null);
    setPodglad(null);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function handlePlikChange(e) {
    const wybrany = e.target.files?.[0] ?? null;
    setPlik(wybrany);
    setPodglad(wybrany ? URL.createObjectURL(wybrany) : null);
  }

  function handleEdit(o) {
    setForm(o);
    setPlik(null);
    setPodglad(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function usunZStorage(url) {
    const sciezka = sciezkaZUrl(url);
    if (!sciezka) return;
    await supabase.storage.from(BUCKET).remove([sciezka]).catch(() => {});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let zdjecieUrl = form.zdjecie_url;

    if (plik) {
      const rozszerzenie = plik.name.split('.').pop();
      const sciezka = `${crypto.randomUUID()}.${rozszerzenie}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(sciezka, plik);

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      if (form.zdjecie_url) await usunZStorage(form.zdjecie_url);
      zdjecieUrl = supabase.storage.from(BUCKET).getPublicUrl(sciezka).data.publicUrl;
    }

    const payload = {
      tytul: form.tytul,
      tresc: form.tresc,
      data_publikacji: form.data_publikacji,
      opublikowane: form.opublikowane,
      zdjecie_url: zdjecieUrl,
    };

    const query = form.id
      ? supabase.from('ogloszenia').update(payload).eq('id', form.id)
      : supabase.from('ogloszenia').insert(payload);

    const { error: saveError } = await query;
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    resetujFormularz();
    refresh();
  }

  async function handleDelete(o) {
    if (!window.confirm('Usunąć to ogłoszenie?')) return;
    const { error: deleteError } = await supabase.from('ogloszenia').delete().eq('id', o.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    if (o.zdjecie_url) await usunZStorage(o.zdjecie_url);
    refresh();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const podgladDoWyswietlenia = podglad ?? form.zdjecie_url;

  return (
    <>
      <div className="admin-header">
        <h1 className="page__title">Panel administracyjny — ogłoszenia</h1>
        <button className="btn" onClick={handleLogout}>Wyloguj się</button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="page__subtitle" style={{ marginTop: 0 }}>
          {form.id ? 'Edytuj ogłoszenie' : 'Nowe ogłoszenie'}
        </h2>

        <label className="kontakt-form__field">
          Tytuł
          <input type="text" name="tytul" value={form.tytul} onChange={handleChange} required />
        </label>

        <label className="kontakt-form__field">
          Treść
          <textarea name="tresc" rows="4" value={form.tresc} onChange={handleChange} required />
        </label>

        <label className="kontakt-form__field">
          Data publikacji
          <input
            type="date"
            name="data_publikacji"
            value={form.data_publikacji}
            onChange={handleChange}
            required
          />
        </label>

        <label className="kontakt-form__field">
          Zdjęcie (opcjonalnie)
          <input type="file" accept="image/*" onChange={handlePlikChange} />
        </label>

        {podgladDoWyswietlenia && (
          <div className="admin-form__podglad">
            <img src={podgladDoWyswietlenia} alt="Podgląd zdjęcia" />
            <button
              type="button"
              className="btn"
              onClick={() => {
                setPlik(null);
                setPodglad(null);
                setForm((f) => ({ ...f, zdjecie_url: null }));
              }}
            >
              Usuń zdjęcie
            </button>
          </div>
        )}

        <label className="admin-form__checkbox">
          <input
            type="checkbox"
            name="opublikowane"
            checked={form.opublikowane}
            onChange={handleChange}
          />
          Widoczne na stronie
        </label>

        <div className="admin-form__actions">
          <button className="btn btn-solid" type="submit" disabled={saving}>
            {saving ? 'Zapisywanie…' : form.id ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}
          </button>
          {form.id && (
            <button type="button" className="btn" onClick={resetujFormularz}>
              Anuluj edycję
            </button>
          )}
        </div>

        {error && <p className="ogloszenie__error">{error}</p>}
      </form>

      <h2 className="page__subtitle">Wszystkie ogłoszenia</h2>
      {loading && <p className="eyebrow-note">Wczytywanie…</p>}

      <div className="admin-list">
        {ogloszenia.map((o) => (
          <article key={o.id} className={`admin-item ${o.opublikowane ? '' : 'is-draft'}`}>
            {o.zdjecie_url && (
              <img className="admin-item__zdjecie" src={o.zdjecie_url} alt="" />
            )}
            <div className="admin-item__tresc">
              <p className="ogloszenie__data">
                {new Date(o.data_publikacji).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {!o.opublikowane && ' — ukryte'}
              </p>
              <h3>{o.tytul}</h3>
              <p>{o.tresc}</p>
            </div>
            <div className="admin-item__actions">
              <button className="btn" onClick={() => handleEdit(o)}>Edytuj</button>
              <button className="btn" onClick={() => handleDelete(o)}>Usuń</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}