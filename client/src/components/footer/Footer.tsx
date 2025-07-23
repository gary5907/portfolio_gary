import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          📧 <a href="mailto:gary.gras07@gmail.com">gary.gras07@gmail.com</a> |
          📱 +33 6 98 36 10 84
        </p>
        <div className="simple-links">
          <a
            href="https://github.com/gary5907"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href="https://linkedin.com/in/votre-profil"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <p>&copy; Mon Portfolio. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
