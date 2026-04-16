import { ArrayView } from "../SVGViews/ArrayView";
import { ListView } from "../SVGViews/ListView";
import { TreeView } from "../SVGViews/TreeView";

import type { StructureType } from "../../App";
import type { ViewProps } from "../../App";
import { useEffect, useRef } from "react";
import { bubbleSort } from "../../animations/array/sorting";


type CenterPanelProps = {
  data: number[];
  structure: StructureType;
}
export function CenterPanel({ data, structure }: CenterPanelProps) {

  const nodeRefs = useRef<Map<number, SVGGElement>>(new Map());

  const structureMap = {
    array: ArrayView,
    list: ListView,
    tree: TreeView,
  } satisfies Record<StructureType, React.FC<ViewProps>>;
  const ViewComponent = structureMap[structure];

  useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "s") {
      bubbleSort(
        [...data.filter(v => !isNaN(v))],
        (i) => nodeRefs.current.get(i) ?? null
      );
    }
  };

  window.addEventListener("keydown", handler);

  return () => {
    window.removeEventListener("keydown", handler);
  };
}, [data]);

  const size = 100;
  return (
    <div id="center-panel" className="panel">
      <div className="bar panel-bar" id="center-panel-bar">Visualization Window
      </div>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        id="canvas"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        {/* <ArrayView size={100} data={data} /> */}
        <ViewComponent size={size} data={data} nodeRefs={nodeRefs} />
      </svg>
    </div>
  )
}