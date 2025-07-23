import { useState } from "react";
import { Link } from "react-router";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Mon Portfolio</Link>
      </div>

      <button
        type="button"
        className={`burger ${menuOpen ? "open" : ""}`}
        onClick={handleToggle}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span className="burger-bar" />
        <span className="burger-bar" />
        <span className="burger-bar" />
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/home" onClick={() => setMenuOpen(false)}>
            Acceuil
          </Link>
        </li>
        <li>
          <Link to="/projets" onClick={() => setMenuOpen(false)}>
            Projets
          </Link>
        </li>
        <li>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            À propos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
