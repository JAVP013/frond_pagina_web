// src/components/Carousel.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Carousel.css";

interface CarouselImage {
  _id: string;
  imageUrl: string;
  caption?: string;
}

const Carousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<CarouselImage[]>("http://localhost:5000/carousel");
        setImages(response.data);
      } catch (error) {
        console.error("Error al cargar carousel:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) {
    return <p>Cargando carousel o sin imágenes...</p>;
  }

  return (
    <div className="carousel">
      <img src={images[index].imageUrl} alt={images[index].caption || "Carousel"} />
      {images[index].caption && <p>{images[index].caption}</p>}
    </div>
  );
};

export default Carousel;
