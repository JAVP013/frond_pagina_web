/* src/App.tsx */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Celulares from "./pages/Celulares";
import AdminLogin from "./pages/admimlog";
import EditImages from "./pages/EditImages"; // La pantalla para editar imágenes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/celulares" element={<Celulares />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/edit-images"
                element={
                  <ProtectedRoute>
                    <EditImages />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
