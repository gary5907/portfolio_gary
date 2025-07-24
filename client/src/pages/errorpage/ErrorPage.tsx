import { useEffect } from "react";
import "./errorPage.css";

export default function ErrorPage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/profil"; 
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="error-container">
            <div className="error-images">
                <img
                    src="/src/assets/image/mobil.png"
                    alt="Erreur 404 mobile"
                    className="error-img error-img--mobile"
                />
                <img
                    src="/src/assets/image/desktop.png"
                    alt="Erreur 404 desktop"
                    className="error-img error-img--desktop"
                />
            </div>
        </div>
    );
}