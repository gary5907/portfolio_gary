import axios from "axios";
import { useEffect, useState } from "react";
import "./Projets.css";

type Skill = {
  id: number;
  name: string;
  image_url?: string;
};

type Projet = {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  user_id: number;
  skills?: Skill[];
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

export default function Projets() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/projets-with-skills`)
      .then((res) => setProjets(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="projets-container">
      <h1>Mes Projets</h1>
      <div className="projets-list">
        {projets.map((projet) => (
          <div key={projet.id} className="projet-card">
            {projet.image_url && (
              <img
                src={projet.image_url}
                alt={projet.title}
                className="projet-img"
              />
            )}
            <h2>{projet.title}</h2>
            <p>{projet.description}</p>
            {projet.skills && projet.skills.length > 0 && (
              <div className="projet-skills">
                <strong>Compétences :</strong>
                <ul>
                  {projet.skills.map((skill) => (
                    <li key={skill.id}>
                      {skill.image_url && (
                        <img
                          src={getImageSrc(skill.image_url)}
                          alt={skill.name}
                          className="skill-img"
                        />
                      )}
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
