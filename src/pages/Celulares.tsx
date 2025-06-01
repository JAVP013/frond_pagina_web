// src/pages/Celulares.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/celulares.css";

interface Phone {
  _id: string;
  brand: string;
  model: string;
  price: number;
  releaseYear: number;
  color?: string;
  size?: string;
  memory?: string;
  cameras?: string;
  imageUrl: string;
}

const popularBrands = ["Apple", "Samsung", "Huawei", "Xiaomi", "LG"];

const Celulares: React.FC = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para filtros y búsqueda
  const [searchText, setSearchText] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Modal "Más información" (usuario normal)
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Modal de edición (admin)
  const [editPhone, setEditPhone] = useState<Phone | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    brand: "",
    model: "",
    price: 0,
    releaseYear: 0,
    size: "",
    memory: "",
    cameras: "",
    imageUrl: ""
  });

  // Modal para agregar dispositivo (admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    brand: "",
    model: "",
    price: 0,
    releaseYear: new Date().getFullYear(),
    size: "",
    memory: "",
    cameras: "",
    imageUrl: ""
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await axios.get<Phone[]>("http://localhost:5000/phones");
        setPhones(response.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los celulares");
      } finally {
        setLoading(false);
      }
    };
    fetchPhones();
  }, []);

  const filteredPhones = phones.filter((phone) => {
    const matchesText =
      phone.model.toLowerCase().includes(searchText.toLowerCase()) ||
      phone.brand.toLowerCase().includes(searchText.toLowerCase());
    const matchesBrand = filterBrand ? phone.brand === filterBrand : true;
    const matchesPrice = filterPrice ? phone.price <= parseFloat(filterPrice) : true;
    const matchesYear = filterYear ? phone.releaseYear === parseInt(filterYear) : true;
    return matchesText && matchesBrand && matchesPrice && matchesYear;
  });

  // Modal "Más información"
  const handleOpenInfoModal = (phone: Phone) => {
    setSelectedPhone(phone);
    setShowInfoModal(true);
    setFile1(null);
    setFile2(null);
    setTermsAccepted(false);
  };

  const handleCloseInfoModal = () => {
    setSelectedPhone(null);
    setShowInfoModal(false);
  };

  // Eliminar teléfono
  const handleDeletePhone = async (phone: Phone) => {
    if (window.confirm(`¿Estás seguro de eliminar ${phone.brand} ${phone.model}?`)) {
      try {
        await axios.delete(`http://localhost:5000/phones/${phone._id}`);
        setPhones(prev => prev.filter(p => p._id !== phone._id));
        window.alert("Teléfono eliminado correctamente");
      } catch (err) {
        console.error(err);
        window.alert("Error al eliminar el teléfono");
      }
    }
  };

  // Modal de edición (admin)
  const handleOpenEditModal = (phone: Phone) => {
    setEditPhone(phone);
    setEditFields({
      brand: phone.brand,
      model: phone.model,
      price: phone.price,
      releaseYear: phone.releaseYear,
      size: phone.size || "",
      memory: phone.memory || "",
      cameras: phone.cameras || "",
      imageUrl: phone.imageUrl
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditPhone(null);
    setShowEditModal(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm("¿Deseas guardar los cambios?")) return;
    try {
      await axios.put(`http://localhost:5000/phones/${editPhone?._id}`, editFields);
      setPhones(prev =>
        prev.map(p => (p._id === editPhone?._id ? { ...p, ...editFields } : p))
      );
      window.alert("Teléfono actualizado correctamente");
      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      window.alert("Error al actualizar el teléfono");
    }
  };

  // Modal para agregar dispositivo (admin)
  const handleOpenAddModal = () => {
    setNewDevice({
      brand: "",
      model: "",
      price: 0,
      releaseYear: new Date().getFullYear(),
      size: "",
      memory: "",
      cameras: "",
      imageUrl: ""
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  const handleSubmitAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm("¿Deseas agregar este dispositivo?")) return;
    try {
      const response = await axios.post("http://localhost:5000/phones", newDevice);
      setPhones(prev => [...prev, response.data]);
      window.alert("Dispositivo agregado correctamente");
      handleCloseAddModal();
    } catch (err) {
      console.error(err);
      window.alert("Error al agregar el dispositivo");
    }
  };

  // Manejo de archivos en "Más información"
  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile1(e.target.files[0]);
    }
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile2(e.target.files[0]);
    }
  };

  const handleSubmitPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Debes aceptar los términos y condiciones, políticas y privacidad.");
      return;
    }
    if (!window.confirm("¿Aceptas enviar tus datos personales junto con los archivos?")) {
      return;
    }
    try {
      if (!file1 || !file2) {
        alert("Por favor, selecciona ambos archivos.");
        return;
      }
      const formData = new FormData();
      formData.append("pdf1", file1);
      formData.append("pdf2", file2);
      if (selectedPhone) {
        formData.append("deviceInfo", JSON.stringify(selectedPhone));
      }
      await axios.post("http://localhost:5000/email/send-email", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Correo enviado con éxito");
      handleCloseInfoModal();
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("Error al enviar correo");
    }
  };

  if (loading) return <p>Cargando celulares...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="celulares-container">
      <h1>Equipos Celulares</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por modelo o marca..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {popularBrands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio máximo"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Año de lanzamiento"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
      </div>

      {isAuthenticated && (
        <button className="btn-add-device" onClick={handleOpenAddModal}>
          Agregar Dispositivo
        </button>
      )}

      <div className="phones-grid">
        {filteredPhones.map((phone) => (
          <div className="phone-card" key={phone._id}>
            <img src={phone.imageUrl} alt={phone.model} className="phone-image" />
            <div className="phone-info">
              <h2>{phone.brand} {phone.model}</h2>
              <p>Pantalla {phone.size}, {phone.memory}, {phone.cameras}</p>
              {isAuthenticated ? (
                <>
                  <button className="btn-delete" onClick={() => handleDeletePhone(phone)}>
                    Eliminar
                  </button>
                  <button className="btn-edit" onClick={() => handleOpenEditModal(phone)}>
                    Editar
                  </button>
                </>
              ) : (
                <button onClick={() => handleOpenInfoModal(phone)}>Más información</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInfoModal && selectedPhone && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedPhone.brand} {selectedPhone.model}</h2>
            <p>Precio: ${selectedPhone.price}</p>
            <p>Año de lanzamiento: {selectedPhone.releaseYear}</p>
            {selectedPhone.color && <p>Color: {selectedPhone.color}</p>}
            {selectedPhone.size && <p>Tamaño: {selectedPhone.size}</p>}
            {selectedPhone.memory && <p>Memoria: {selectedPhone.memory}</p>}
            {selectedPhone.cameras && <p>Cámaras: {selectedPhone.cameras}</p>}
            <img
              src={selectedPhone.imageUrl}
              alt={selectedPhone.model}
              style={{ width: "200px", height: "auto", borderRadius: "5px" }}
            />
            <form className="pdf-form" onSubmit={handleSubmitPDF}>
              <div className="form-group">
                <label>Seleccionar el PDF de su INE:</label>
                <input type="file" accept=".pdf" onChange={handleFile1Change} required />
              </div>
              <div className="form-group">
                <label>Seleccionar el PDF de su comprobante de domicilio:</label>
                <input type="file" accept=".pdf" onChange={handleFile2Change} required />
              </div>
              <div className="form-group terms">
                <label>
                  <input 
                    type="checkbox" 
                    checked={termsAccepted} 
                    onChange={(e) => setTermsAccepted(e.target.checked)} 
                  />
                  Acepto los términos y condiciones, políticas y privacidad.
                  <a href="https://live-upstream.payjoy.com/mx/politica-de-privacidade " 
                  target="_blank" rel="noopener noreferrer">Ver Política de Privacidad</a>
                </label>
              </div>
              <button type="submit">Enviar</button>
            </form>
            <button className="close-btn" onClick={handleCloseInfoModal}>X</button>
          </div>
        </div>
      )}

      {showEditModal && editPhone && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar {editPhone.brand} {editPhone.model}</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="form-group">
                <label>Marca:</label>
                <select name="brand" value={editFields.brand} onChange={handleEditChange}>
                  <option value="">Selecciona una marca</option>
                  {popularBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modelo:</label>
                <input type="text" name="model" value={editFields.model} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input type="number" name="price" value={editFields.price} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Año de lanzamiento:</label>
                <input type="number" name="releaseYear" value={editFields.releaseYear} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Tamaño:</label>
                <input type="text" name="size" value={editFields.size} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Memoria:</label>
                <input type="text" name="memory" value={editFields.memory} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Cámaras:</label>
                <input type="text" name="cameras" value={editFields.cameras} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Link de imagen:</label>
                <input type="text" name="imageUrl" value={editFields.imageUrl} onChange={handleEditChange} />
              </div>
              {editFields.imageUrl && (
                <img
                  src={editFields.imageUrl}
                  alt="Vista previa"
                  style={{ width: "200px", height: "auto", borderRadius: "5px", marginTop: "10px" }}
                />
              )}
              <button type="submit">Guardar cambios</button>
            </form>
            <button className="close-btn" onClick={handleCloseEditModal}>X</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Dispositivo</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="form-group">
                <label>Marca:</label>
                <select name="brand" value={newDevice.brand} onChange={handleAddChange}>
                  <option value="">Selecciona una marca</option>
                  {popularBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modelo:</label>
                <input type="text" name="model" value={newDevice.model} onChange={handleAddChange} placeholder="Nombre del modelo del equipo celular" />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input type="number" name="price" value={newDevice.price} onChange={handleAddChange} placeholder="precio del equipo celular" />
              </div>
              <div className="form-group">
                <label>Año de lanzamiento:</label>
                <input type="number" name="releaseYear" value={newDevice.releaseYear} onChange={handleAddChange} />
              </div>
              <div className="form-group">
                <label>Tamaño:</label>
                <input type="text" name="size" value={newDevice.size} onChange={handleAddChange} placeholder="Tamaño de la pantalla del equipo celular"/>
              </div>
              <div className="form-group">
                <label>Memoria:</label>
                <input type="text" name="memory" value={newDevice.memory} onChange={handleAddChange} placeholder="Tamaño del almacenamiento del equipo celular" />
              </div>
              <div className="form-group">
                <label>Cámaras:</label>
                <input type="text" name="cameras" value={newDevice.cameras} onChange={handleAddChange} placeholder="Características de la cámaras del equipo celular" />
              </div>
              <div className="form-group">
                <label>Link de imagen:</label>
                <input type="text" name="imageUrl" value={newDevice.imageUrl} onChange={handleAddChange} placeholder="Link de la imagen del equipo celular" />
              </div>
              {newDevice.imageUrl && (
                <img
                  src={newDevice.imageUrl}
                  alt="Vista previa"
                  style={{ width: "200px", height: "auto", borderRadius: "5px", marginTop: "10px" }}
                />
              )}
              <button type="submit">Agregar dispositivo</button>
            </form>
            <button className="close-btn" onClick={handleCloseAddModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Celulares;
