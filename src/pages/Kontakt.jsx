import { useState } from 'react';
import { parafia } from '../data/parafia.js';
import './Kontakt.css';

function encode(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

export default function Kontakt() {
  const [form, setForm] = useState({ imie: '', email: '', wiadomosc: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'kontakt', ...form }),
      });
      setStatus('sent');
      setForm({ imie: '', email: '', wiadomosc: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container page">
      <h1 className="page__title">Kontakt</h1>

      <div className="kontakt-grid">
        <div>
          <h2 className="page__subtitle" style={{ marginTop: 0 }}>Kancelaria parafialna</h2>
          <p>
            {parafia.adres.kosciol}
            <br />
            {parafia.adres.ulica}
            <br />
            {parafia.adres.kodMiasto}
          </p>
          <p>
            Tel. <a href={`tel:${parafia.kontakt.telefon.replace(/\s+/g, '')}`}>{parafia.kontakt.telefon}</a>
            <br />
            E-mail: <a href={`mailto:${parafia.kontakt.email}`}>{parafia.kontakt.email}</a>
          </p>

          <div className="map-frame">
            <iframe
              title="Mapa dojazdu"
              src={parafia.mapa.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="btn" href={parafia.mapa.link} target="_blank" rel="noreferrer">
            Otwórz w Mapach Google
          </a>
        </div>

        <div>
          <h2 className="page__subtitle" style={{ marginTop: 0 }}>Napisz do nas</h2>

          {status === 'sent' ? (
            <p className="kontakt-form__success">Dziękujemy za wiadomość — odpowiemy najszybciej, jak to możliwe.</p>
          ) : (
            <form
              name="kontakt"
              className="kontakt-form"
              onSubmit={handleSubmit}
              data-netlify="true"
              netlify-honeypot="firma"
            >
              <input type="hidden" name="form-name" value="kontakt" />
              <p className="visually-hidden">
                <label>
                  Nie wypełniaj tego pola: <input name="firma" onChange={handleChange} />
                </label>
              </p>

              <label className="kontakt-form__field">
                Imię i nazwisko
                <input type="text" name="imie" required value={form.imie} onChange={handleChange} />
              </label>

              <label className="kontakt-form__field">
                Adres e-mail
                <input type="email" name="email" required value={form.email} onChange={handleChange} />
              </label>

              <label className="kontakt-form__field">
                Wiadomość
                <textarea name="wiadomosc" rows="5" required value={form.wiadomosc} onChange={handleChange} />
              </label>

              <button className="btn btn-solid" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
              </button>

              {status === 'error' && (
                <p className="kontakt-form__error">
                  Coś poszło nie tak. Napisz bezpośrednio na {parafia.kontakt.email}.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
