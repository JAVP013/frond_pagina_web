import Carousel from "../components/Carousel";
import TestImage from "../components/imagenNos";
import StoreMap from "../components/StoreMap";
import "../styles/global.css";


const Home = () => {
  return (
    <div>
      

      <div className="container">
        <h1>Bienvenido a RomaShop</h1>
        <p>Las mejores ofertas en celulares y accesorios</p>
      </div>

      <Carousel />

      <section className="nosotros">
      <h2>Nosotros</h2>
        <p>
          Somos una tienda dedicada a ofrecerte los mejores celulares y
          accesorios al mejor precio. Nos enfocamos en calidad, servicio y una
          experiencia de compra sencilla y rápida.
        </p>

        {/* Contenedor para la imagen */}
        <TestImage />

        <h2>Ubicación de la Tienda</h2>
        <StoreMap />
</section>
    </div>
  );
};

export default Home;
