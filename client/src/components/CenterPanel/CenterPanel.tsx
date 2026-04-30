import { ArrayView } from "../SVGViews/ArrayView";
import { ListView } from "../SVGViews/ListView";
import { TreeView } from "../SVGViews/TreeView";

import type { DataItem, StructureType } from "../../App";
import type { ViewProps } from "../../App";

type CenterPanelProps = {
  data: DataItem[];
  structure: StructureType;
  nodeRefs: React.RefObject<Map<number, SVGGElement>>;
  size: number;
}
export function CenterPanel({
  data,
  structure,
  nodeRefs,
  size,
}: CenterPanelProps) {


  const structureMap = {
    array: ArrayView,
    list: ListView,
    tree: TreeView,
  } satisfies Record<StructureType, React.FC<ViewProps>>;
  const ViewComponent = structureMap[structure];


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
          {/* change the stdDeviation to control glow strength */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* <ArrayView size={100} data={data} /> */}
        <ViewComponent size={size} data={data} nodeRefs={nodeRefs} />
      </svg>
    </div>
  )
}