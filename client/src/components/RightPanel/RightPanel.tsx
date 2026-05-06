import type { AlgoType, StructureType } from "../../App"
import { algoInfoMap } from "./RightPanelData";

type RightPanelProps = {
    structure: StructureType;
    algorithm: AlgoType;
}
export function RightPanel({ structure, algorithm }: RightPanelProps) {
    const info = algoInfoMap[structure][algorithm];
    return (
        <div id="right-panel" className="panel">
            <div className="bar panel-bar" id="right-panel">Information</div>
            {info && <div className="panel-content right-panel-content">

                <h2>{info.name}</h2>
                <hr/>
                <h3>Pseudocode</h3>
                {info.pseudocode}

                <hr />

                <h3>Complexity</h3>


                Time  : {info.time}<br/>
                Space : {info.space}

                <hr />

                <h3>Description</h3>
                {info.description}
            </div>}
        </div>
    )
}