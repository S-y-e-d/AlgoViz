import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisualizerPage } from "./pages/VisualizerPage";
import { HomePage } from "./pages/HomePage";

export type StructureType = "array" | "list" | "tree";
export type AlgoType = 
  "insertion" | 
  "deletion" | 
  "binarySearch" | 
  "linearSearch"|
  "bubbleSort" | 
  "insertionSort"|
  "selectionSort"|
  "mergeSort"
;

export type GetElementByIndex = (index: number) => SVGGElement | null;
export type DataItem = {
  val: number,
  id: string,
}

type NodeRefs = {
  current: Map<number, SVGGElement>;
};
export type ViewProps = {
  size: number;
  data: DataItem[];
  nodeRefs: NodeRefs;
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
