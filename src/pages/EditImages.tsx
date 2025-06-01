// src/pages/EditImages.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/EditImages.css";

interface CarouselImage {
  _id: string;
  imageUrl: string;
  caption?: string;
}

interface Brand {
  _id: string;
  logoUrl: string;
  brandName?: string;
}

interface CompanyImage {
  _id: string;
  imageUrl: string;
}

interface StoreLocation {
  _id: string;
  address: string;
  latitude: number;
  longitude: number;
  branchName: string;
}

const EditImages: React.FC = () => {
  // Sección: Carrusel
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Sección: Logo
  const [brand, setBrand] = useState<Brand | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState("");

  // Sección: Imagen "Nosotros"
  const [companyImage, setCompanyImage] = useState<CompanyImage | null>(null);
  const [newCompanyImageUrl, setNewCompanyImageUrl] = useState("");

  // Sección: Ubicación de la Tienda

    const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [newLocation, setNewLocation] = useState({
    address: "",
    latitude: "",
    longitude: "",
    branchName: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar Carrusel
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CarouselImage[]>("http://localhost:5000/carousel");
      setImages(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar las imágenes del carrusel");
    } finally {
      setLoading(false);
    }
  };

  // Cargar Logo
  const fetchBrand = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Brand>("http://localhost:5000/brand");
      setBrand(response.data);
      setNewLogoUrl(response.data.logoUrl);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar el logo");
    } finally {
      setLoading(false);
    }
  };

  // Cargar Imagen "Nosotros"
  const fetchCompanyImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CompanyImage>("http://localhost:5000/company");
      setCompanyImage(response.data);
      setNewCompanyImageUrl(response.data.imageUrl);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar la imagen de Nosotros");
    } finally {
      setLoading(false);
    }
  };

  // Cargar Ubicación
   const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get<StoreLocation[]>("http://localhost:5000/store-location");
      setLocations(response.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar ubicaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
    fetchImages();
    fetchCompanyImage();
    fetchLocations();
  }, []);

  // Actualizar Logo
  const handleUpdateLogo = async () => {
    if (!window.confirm("¿Deseas actualizar el logo?")) return;
    try {
      setLoading(true);
      const response = await axios.put("http://localhost:5000/brand", { logoUrl: newLogoUrl });
      setBrand(response.data);
      setError("");
      window.alert("Logo actualizado correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el logo");
      window.alert("Error al actualizar el logo");
    } finally {
      setLoading(false);
    }
  };

  // Agregar imagen al Carrusel
  const handleAddImage = async () => {
    if (images.length >= 5) {
      window.alert("Solo se permite un máximo de 5 imágenes");
      return;
    }
    if (!newImageUrl.trim()) return;
    if (!window.confirm("¿Deseas agregar esta imagen al carrusel?")) return;
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/carousel", { imageUrl: newImageUrl });
      setImages((prev) => [...prev, response.data]);
      setNewImageUrl("");
      setError("");
      window.alert("Imagen agregada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al agregar la imagen");
      window.alert("Error al agregar la imagen");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar imagen del Carrusel
  const handleDeleteImage = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/carousel/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
      setError("");
      window.alert("Imagen eliminada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la imagen");
      window.alert("Error al eliminar la imagen");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar imagen "Nosotros"
  const handleUpdateCompanyImage = async () => {
    if (!window.confirm("¿Deseas actualizar la imagen de Nosotros?")) return;
    try {
      setLoading(true);
      const response = await axios.put("http://localhost:5000/company", { imageUrl: newCompanyImageUrl });
      setCompanyImage(response.data);
      setError("");
      window.alert("Imagen de Nosotros actualizada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la imagen de Nosotros");
      window.alert("Error al actualizar la imagen de Nosotros");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar Ubicación
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    const { address, latitude, longitude, branchName } = newLocation;

    if (!address || !latitude || !longitude || !branchName) {
      window.alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        // Actualizar
        const response = await axios.put(`http://localhost:5000/store-location/${editingId}`, {
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          branchName
        });
        setLocations((prev) =>
          prev.map((loc) => (loc._id === editingId ? response.data : loc))
        );
        setEditingId(null);
      } else {
        // Crear nueva
        const response = await axios.post("http://localhost:5000/store-location", {
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          branchName
        });
        setLocations((prev) => [...prev, response.data]);
      }

      setNewLocation({ address: "", latitude: "", longitude: "", branchName: "" });
    } catch (err) {
      console.error(err);
      window.alert("Error al guardar la sucursal");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: StoreLocation) => {
    setEditingId(location._id);
    setNewLocation({
      address: location.address,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      branchName: location.branchName
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta sucursal?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/store-location/${id}`);
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      console.error(err);
      window.alert("Error al eliminar la sucursal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Administración</h1>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Cargando...</p>}

      {/* Sección: Editar Logo */}
      <section className="edit-logo-section">
        <h2 className="section-title">Editar Logo de la pagina</h2>
        {brand && (
          <div className="logo-container">
            <img src={brand.logoUrl} alt={brand.brandName || "Logo"} className="logo-img" />
            <div className="logo-update-form">
              <input
                type="text"
                placeholder="Ingresa el nuevo link del logo"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                className="logo-input"
              />
              <button onClick={handleUpdateLogo} className="update-logo-btn">
                Actualizar Logo
              </button>
            </div>
          </div>
        )}
      </section>
      <hr className="divider" />

      {/* Sección: Editar Carrusel */}
      <section className="edit-carousel-section">
        <h2 className="section-title">Editar imagenes en movimiento (Imágenes actuales: {images.length} de 5)</h2>
        <ul className="carousel-list">
          {images.map((image) => (
            <li key={image._id} className="carousel-item">
              <img src={image.imageUrl} alt={image.caption || "Imagen del carrusel"} className="carousel-img" />
              <span className="carousel-url">{image.imageUrl}</span>
              <button onClick={() => handleDeleteImage(image._id)} className="btn-delete">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        {images.length < 5 && (
          <div className="carousel-add-form">
            <input
              type="text"
              placeholder="Ingresa el link de la imagen"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="carousel-input"
            />
            <button onClick={handleAddImage} className="add-btn">
              Agregar
            </button>
          </div>
        )}
      </section>
      <hr className="divider" />

      {/* Sección: Editar Imagen de Nosotros */}
      <section className="edit-company-section">
        <h2 className="section-title">Editar Imagen de Nosotros</h2>
        {companyImage && (
          <div className="company-container">
            <img src={companyImage.imageUrl} alt="Imagen de Nosotros" className="company-img" />
            <div className="company-update-form">
              <input
                type="text"
                placeholder="Ingresa el nuevo link de la imagen de Nosotros"
                value={newCompanyImageUrl}
                onChange={(e) => setNewCompanyImageUrl(e.target.value)}
                className="company-input"
              />
              <button onClick={handleUpdateCompanyImage} className="update-company-btn">
                Actualizar Imagen
              </button>
            </div>
          </div>
        )}
      </section>
      <hr className="divider" />

      {/* Sección: Editar Ubicación de la Tienda */}
       <section className="edit-location-section">
        <h2 className="section-title">Ubicaciones de Sucursales</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Cargando...</p>}

      <div className="location-form">
        <input
          name="branchName"
          placeholder="Nombre de la sucursal"
          value={newLocation.branchName}
          onChange={handleInputChange}
        />
        <input
          name="address"
          placeholder="Dirección"
          value={newLocation.address}
          onChange={handleInputChange}
        />
        <input
          name="latitude"
          placeholder="Latitud"
          value={newLocation.latitude}
          onChange={handleInputChange}
        />
        <input
          name="longitude"
          placeholder="Longitud"
          value={newLocation.longitude}
          onChange={handleInputChange}
        />
        <button onClick={handleAddOrUpdate}>
          {editingId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <ul className="location-list">
        {locations.map((loc) => (
          <li key={loc._id} className="location-item">
            <strong>{loc.branchName}</strong> - {loc.address}
            <br />
            📍 ({loc.latitude}, {loc.longitude})
            <br />
            <button onClick={() => handleEdit(loc)}>Editar</button>
            <button onClick={() => handleDelete(loc._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </section>
    </div>
  );
};

export default EditImages;
