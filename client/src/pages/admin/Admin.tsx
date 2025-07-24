import axios from "axios";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import "../admin/admin.css";

interface SkillType {
  id: number;
  name: string;
  image_url?: string;
}

interface SkillFormData {
  name: string;
  image?: FileList;
}

type TabType = "skills" | "projects";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("skills");
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [editingSkill, setEditingSkill] = useState<SkillType | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 👈 AJOUTÉ

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SkillFormData>();

  const watchedImage = watch("image");

  useEffect(() => {
    if (activeTab === "skills") {
      fetchSkills();
    }
  }, [activeTab]);

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [watchedImage]);

  const resetForm = () => {
    reset();
    setPreviewImage(null);
    setEditingSkill(null);
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/skills`,
      );
      setSkills(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des skills:", error);
      showMessage("error", "Erreur lors du chargement des compétences");
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onSubmit: SubmitHandler<SkillFormData> = async (data) => {
    setLoading(true);

    try {
      if (!editingSkill) {
        const existingSkill = skills.find(
          (skill) => skill.name.toLowerCase() === data.name.toLowerCase(),
        );

        if (existingSkill) {
          showMessage("error", "Cette compétence existe déjà !");
          setLoading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      if (editingSkill) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/skills/${editingSkill.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        showMessage("success", "Compétence mise à jour avec succès !");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/skills`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        showMessage("success", "Compétence créée avec succès !");
      }

      resetForm();
      fetchSkills();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erreur lors de la sauvegarde";
        showMessage("error", errorMsg);
      } else {
        showMessage("error", "Erreur lors de la sauvegarde");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: SkillType) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
    });
    setPreviewImage(skill.image_url || null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (skillId: number, skillName: string) => {
    if (
      !window.confirm(`Êtes-vous sûr de vouloir supprimer "${skillName}" ?`)
    ) {
      return;
    }

    setLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/skills/${skillId}`,
        { withCredentials: true },
      );

      showMessage("success", "Compétence supprimée avec succès !");
      fetchSkills();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showMessage("error", "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin</h1>
        <p>Gestion des compétences et projets</p>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === "skills" ? "admin-tab--active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          🛠️ Compétences
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "projects" ? "admin-tab--active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          📁 Projets
        </button>
      </div>

      {message && (
        <div className={`admin-message admin-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div
        className={`admin-tab-content ${activeTab === "skills" ? "admin-tab-content--active" : ""}`}
      >
        <section className="admin-form-section">
          <h2>
            {editingSkill
              ? `Modifier "${editingSkill.name}"`
              : "Ajouter une nouvelle compétence"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
            <div className="admin-form-group">
              <label htmlFor="name" className="admin-label">
                Nom de la compétence *
              </label>
              <input
                type="text"
                id="name"
                className={`admin-input ${errors.name ? "admin-input--error" : ""}`}
                {...register("name", {
                  required: "Le nom est requis",
                  minLength: {
                    value: 1,
                    message: "Le nom doit contenir au moins 1 caractère",
                  },
                  maxLength: {
                    value: 255,
                    message: "Le nom ne peut pas dépasser 255 caractères",
                  },
                })}
                placeholder="Ex: React, JavaScript, Node.js..."
              />
              {errors.name && (
                <span className="admin-error">{errors.name.message}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="image" className="admin-label">
                Image de la compétence
              </label>
              <input
                type="file"
                id="image"
                className="admin-input"
                accept="image/*"
                {...register("image")}
              />
              <small className="admin-help">
                Formats acceptés : JPG, PNG, SVG
              </small>

              {previewImage && (
                <div style={{ marginTop: "10px" }}>
                  <p className="admin-label">Aperçu :</p>
                  <div
                    style={{
                      border: "2px dashed #c8e6c9",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                      backgroundColor: "#f0f8f0",
                    }}
                  >
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                    <p
                      style={{
                        marginTop: "5px",
                        fontSize: "0.85rem",
                        color: "#4a7c59",
                      }}
                    >
                      ✅ Image sélectionnée
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={loading}
              >
                {loading
                  ? "⏳ En cours..."
                  : editingSkill
                    ? "✏️ Modifier"
                    : "➕ Créer"}
              </button>

              {editingSkill && (
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  ❌ Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-skills-section">
          <h2>Compétences existantes ({skills.length})</h2>

          {skills.length === 0 ? (
            <div className="admin-empty">
              <p>Aucune compétence trouvée</p>
            </div>
          ) : (
            <div className="admin-skills-grid">
              {skills.map((skill) => (
                <div key={skill.id} className="admin-skill-card">
                  <div className="admin-skill-icon">
                    {skill.image_url ? (
                      <img
                        src={skill.image_url}
                        alt={`Logo ${skill.name}`}
                        className="admin-skill-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="admin-skill-fallback"
                      style={{ display: skill.image_url ? "none" : "flex" }}
                    >
                      {skill.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <h3 className="admin-skill-name">{skill.name}</h3>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--edit"
                      onClick={() => handleEdit(skill)}
                      disabled={loading}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--delete"
                      onClick={() => handleDelete(skill.id, skill.name)}
                      disabled={loading}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div
        className={`admin-tab-content ${activeTab === "projects" ? "admin-tab-content--active" : ""}`}
      >
        <section className="admin-projects-section">
          <h2>Gestion des Projets</h2>
          <div className="admin-empty">
            <p>🚧 Section en cours de développement</p>
            <p>La gestion des projets sera bientôt disponible !</p>
          </div>
        </section>
      </div>
    </div>
  );
}
