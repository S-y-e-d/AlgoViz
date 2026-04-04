import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisualizerPage } from "./pages/VisualizerPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/viz" element={<VisualizerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
