import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisualizerPage } from "./pages/VisualizerPage";
import { HomePage } from "./pages/HomePage";

export type StructureType = "array" | "list" | "tree";
export type ViewProps = {
  size: number;
  data: number[];
};

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
