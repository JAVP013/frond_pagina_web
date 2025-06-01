// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brand, setBrand] = useState<any>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get("http://localhost:5000/brand");
        setBrand(response.data);
      } catch (error) {
        console.error("Error al cargar el logo:", error);
      }
    };
    fetchBrand();
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        {brand && (
          <img src={brand.logoUrl} alt={brand.brandName || "MiTienda"} className="logo-img" />
        )}
      </Link>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <ul className={`menu ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/celulares" onClick={() => setMenuOpen(false)}>
            Celulares
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/admin/edit-images" onClick={() => setMenuOpen(false)}>
                Edición
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="logout-btn"
              >
                Salir
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
