import "../login/login.css";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/authContext";

type FormType = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { authenticate } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
        { withCredentials: true },
      );

      const user = response.data;

      authenticate(user);
      navigate("/admin");
    } catch (err) {
      setErrorMsg("Erreur de la connexion. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1>🔐 Connexion</h1>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        <div className="form-group">
          <label htmlFor="email">📧 Email</label>
          <input
            {...register("email", {
              required: "Merci de compléter ce champ",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Le format d'email est incorrect",
              },
            })}
            type="email"
            id="email"
            className={errors.email ? "error" : ""}
            autoComplete="username"
            placeholder="Entrez votre email"
          />
          {errors.email && (
            <p className="field-error">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">🔒 Mot de passe</label>
          <input
            {...register("password", {
              required: "Merci de compléter ce champ",
              pattern: {
                value:
                  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
                message:
                  "Le mot de passe doit contenir 8-16 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
              },
            })}
            type="password"
            id="password"
            className={errors.password ? "error" : ""}
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </div>

        <motion.button
          type="submit"
          className="login-button"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "⏳ Connexion..." : "Se connecter"}
        </motion.button>
      </form>
    </div>
  );
}
