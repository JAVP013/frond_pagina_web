// src/components/StoreMap.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import axios from "axios";

interface StoreLocation {
  _id: string;
  address: string;
  latitude: number;
  longitude: number;
  branchName: string;
}

const DefaultIcon = (L as any).Icon.Default;
delete DefaultIcon.prototype._getIconUrl;
DefaultIcon.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

const StoreMap: React.FC = () => {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get<StoreLocation[]>("http://localhost:5000/store-location");
        setLocations(response.data);
      } catch (err) {
        console.error("Error fetching store locations:", err);
        setError("Error al cargar las ubicaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) return <p>Cargando mapa...</p>;
  if (error) return <p>{error}</p>;
  if (!locations.length) return <p>No hay ubicaciones disponibles.</p>;

  const defaultPosition: [number, number] = [locations[0].latitude, locations[0].longitude];

  return (
    <div style={{ height: "400px", width: "100%", margin: "0 auto" }}>
      <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((location) => (
          <Marker key={location._id} position={[location.latitude, location.longitude]}>
            <Popup>
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1a73e8", textDecoration: "underline", fontWeight: "bold" }}
              >
                Ver {location.branchName} en Google Maps
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StoreMap;
