import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisualizerPage } from "./pages/VisualizerPage";
import { HomePage } from "./pages/HomePage";

export type StructureType = "array" | "list" | "tree";
export type listAlgoType = "insertion" | "deletion";
export type arrayAlgoType =
  listAlgoType
  | "binarySearch"
  | "linearSearch"
  | "bubbleSort"
  | "insertionSort"
  | "selectionSort"
  | "mergeSort";

export type treeAlgoType =
  "preorder"
  | "inorder"
  | "postorder";

export type AlgoType = "" | listAlgoType | arrayAlgoType | treeAlgoType;

export type GetNodeByIndex = (index: number) => SVGGElement | null;
export type GetEdgeByIndex = (index: number) => SVGLineElement | null;

export type DataItem = {
  val: number,
  id: string,
}

type NodeRefs = {
  current: Map<number, NodeGroup>;
};
export type ViewProps = {
  size: number;
  data: DataItem[];
  nodeRefs: NodeRefs;
};

export type AlgorithmParams = {
  array: DataItem[];
  value?: number;
  index?: number;
  getNode: GetNodeByIndex;
  getEdge: GetEdgeByIndex;
  isTLPaused: React.RefObject<boolean>;
}

export type ColorType = "yellow" | "orange" | "red" | "green" | "blue" | "lime";

export type NodeGroup = { node: SVGGElement | null, edge: SVGLineElement | null };

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
