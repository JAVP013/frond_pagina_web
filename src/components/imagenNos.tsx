// src/components/TestImage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";

interface CompanyData {
  _id: string;
  imageUrl: string;
  description?: string;
}

const TestImage: React.FC = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get<CompanyData>("http://localhost:5000/company");
        setCompany(response.data);
      } catch (err) {
        console.error("Error al cargar la imagen de la empresa:", err);
        setError("Error al cargar la imagen de la empresa");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  if (loading) return <p>Cargando imagen de la empresa...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="nosotros">
      <div className="image-container">
        <img src={company?.imageUrl} alt="Imagen de la Empresa" />
      </div>
      {company?.description && <p>{company.description}</p>}
    </div>
  );
};

export default TestImage;
