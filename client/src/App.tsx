import "./App.css";
import { Outlet } from "react-router";
import { AuthProvider } from "../src/auth/authContext";
import Footer from "../src/components/footer/Footer";
import Navbar from "../src/components/navbar/Navbar";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
