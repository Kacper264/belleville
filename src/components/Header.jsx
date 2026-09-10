import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { parafia } from '../data/parafia.js';
import './Header.css';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <NavLink to="/" className="site-header__mark" onClick={() => setOpen(false)}>
          <span className="site-header__mark-top">{parafia.nazwa}</span>
          <span className="site-header__mark-sub">{parafia.wezwanie}</span>
        </NavLink>

        <button
          className="site-header__toggle"
          aria-expanded={open}
          aria-label="Otwórz menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-header__nav ${open ? 'is-open' : ''}`}>
          {parafia.nawigacja.map((item) => (
            <NavLink
              key={item.do}
              to={item.do}
              end={item.do === '/'}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {item.etykieta}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
