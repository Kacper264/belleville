import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Historia from './pages/Historia.jsx';
import Sakramenty from './pages/Sakramenty.jsx';
import Ogloszenia from './pages/Ogloszenia.jsx';
import Kontakt from './pages/Kontakt.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/sakramenty" element={<Sakramenty />} />
          <Route path="/ogloszenia" element={<Ogloszenia />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
