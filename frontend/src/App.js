import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from './pages/LandingPage';
import ServicePage from './pages/ServicePage';
import Analytics, { initAnalytics } from './components/Analytics';
import { Toaster } from "sonner";

function App() {
  // Инициализация аналитики при загрузке приложения
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Analytics />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#171717',
              border: '1px solid #262626',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;