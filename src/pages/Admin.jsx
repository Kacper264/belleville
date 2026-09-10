import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.js';
import LoginForm from '../components/LoginForm.jsx';
import './Admin.css';

const PUSTY_FORMULARZ = { id: null, tytul: '', tresc: '', data_publikacji: '', opublikowane: true };

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleEdit(o) {
    setForm(o);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      tytul: form.tytul,
      tresc: form.tresc,
      data_publikacji: form.data_publikacji,
      opublikowane: form.opublikowane,
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
    setForm(dzisiajFormularz());
    refresh();
  }

  async function handleDelete(id) {
    if (!window.confirm('Usunąć to ogłoszenie?')) return;
    const { error: deleteError } = await supabase.from('ogloszenia').delete().eq('id', id);
    if (deleteError) setError(deleteError.message);
    else refresh();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

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
            <button type="button" className="btn" onClick={() => setForm(dzisiajFormularz())}>
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
            <div>
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
              <button className="btn" onClick={() => handleDelete(o.id)}>Usuń</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
