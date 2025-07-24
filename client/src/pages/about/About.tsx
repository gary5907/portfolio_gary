import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1>À propos de moi</h1>
      <div className="about-content">
        <div className="about-photo">
          <img
            src="/src/assets/image/gary.PNG"
            alt="Ma"
            style={{
              width: "180px",
              height: "250px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #4a7c59",
              boxShadow: "0 2px 8px #0002",
            }}
          />
        </div>
        <div className="about-text">
          <p>
            Je m'appelle Gary Gras, passionné par le développement web, j’ai
            choisi de faire de ma curiosité et de ma créativité un véritable
            moteur professionnel. Après un parcours riche en expériences
            humaines et techniques, je me consacre aujourd’hui à la création de
            solutions web modernes, accessibles et efficaces. Autonome mais
            adepte du travail en équipe, j’aime relever des défis techniques,
            apprendre en continu et partager mes connaissances. Que ce soit pour
            concevoir une interface intuitive, développer une application
            responsive ou optimiser les performances d’un site, je m’engage
            toujours avec rigueur et enthousiasme. Mon objectif : mettre le code
            au service des idées, en alliant esthétisme, performance et
            simplicité d’utilisation.
          </p>
          <a
            href="/assets/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="about-cv-link"
          >
            Télécharger mon CV
          </a>
        </div>
      </div>
    </div>
  );
}
