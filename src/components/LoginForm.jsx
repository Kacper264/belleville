import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) setError('Nieprawidłowy e-mail lub hasło.');
  }

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <h1 className="page__title">Panel administracyjny</h1>
      <label className="kontakt-form__field">
        E-mail
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </label>
      <label className="kontakt-form__field">
        Hasło
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      {error && <p className="ogloszenie__error">{error}</p>}
      <button className="btn btn-solid" type="submit" disabled={submitting}>
        {submitting ? 'Logowanie…' : 'Zaloguj się'}
      </button>
    </form>
  );
}
