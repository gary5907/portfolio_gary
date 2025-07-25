import { useEffect, useState } from "react";
import "./profil.css";

interface SkillType {
  id: number;
  name: string;
  image_url?: string;
}

const Profil = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/skills`;
        const response = await fetch(apiUrl);
        if (!response.ok)
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        const data: SkillType[] = await response.json();
        setSkills(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue s'est produite";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleRetry = (): void => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/api/skills`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(setSkills)
      .catch((err) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue s'est produite";
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const getImageSrc = (imageUrl?: string) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    if (!imageUrl) return "";
    if (baseUrl.endsWith("/") && imageUrl.startsWith("/")) {
      return baseUrl + imageUrl.slice(1);
    }
    if (!baseUrl.endsWith("/") && !imageUrl.startsWith("/")) {
      return `${baseUrl}/${imageUrl}`;
    }
    return baseUrl + imageUrl;
  };

  return (
    <div className="profil-container">
      <header className="profil-header">
        <h1 className="profil-title">Bienvenue</h1>
        <img
          src="/src/assets/image/riviere_code.png"
          alt="arbre code"
          className="profil-photo"
        />
        <p className="profil-description">
          Je suis développeur web et mobile, passionné par la création
          d’interfaces simples, modernes et efficaces. Toujours à l’écoute des
          besoins des utilisateurs, je m’efforce de créer des solutions faciles
          à prendre en main, évolutives et robustes. Curieux des avancées
          technologiques et engagé dans une veille technique régulière, je
          cherche constamment à progresser et à améliorer mes compétences. Le
          code propre, le travail d’équipe et l’apprentissage continu font
          partie de mes priorités au quotidien.
        </p>
      </header>

      <section className="profil-skills-section">
        <h2 className="profil-section-title">Mes Compétences Techniques</h2>

        {loading && (
          <div className="profil-loading">
            <p>⏳ Chargement des compétences...</p>
          </div>
        )}

        {error && (
          <div className="profil-error">
            <p>❌ {error}</p>
            <button
              type="button"
              className="profil-retry-button"
              onClick={handleRetry}
            >
              🔄 Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="profil-skills-grid">
            {skills.length > 0 ? (
              skills.map((skill) => {
                return (
                  <div key={skill.id} className="profil-skill-card">
                    <div className="profil-skill-icon-wrapper">
                      {skill.image_url ? (
                        <img
                          src={getImageSrc(skill.image_url)}
                          alt={`Icône ${skill.name}`}
                          className="profil-skill-icon"
                        />
                      ) : null}
                      <div
                        className="profil-skill-fallback"
                        style={{ display: skill.image_url ? "none" : "flex" }}
                      >
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h3 className="profil-skill-name">{skill.name}</h3>
                  </div>
                );
              })
            ) : (
              <div className="profil-no-skills">
                <p>📭 Aucune compétence trouvée</p>
                <button
                  type="button"
                  className="profil-retry-button"
                  onClick={handleRetry}
                >
                  🔄 Recharger
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profil;
