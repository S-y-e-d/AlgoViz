import { useState } from "react"
import { Button } from "../Button/Button"
import type { StructureType } from "../../App";

type LeftPanelProps = {
    onDataChange: (data: number[]) => void;
    structure: StructureType;
    setStructure: (structure: StructureType) => void;
    isAnimating: boolean;
};

export function LeftPanel({ onDataChange, structure, setStructure, isAnimating}: LeftPanelProps) {

    const [sizeSliderValue, setSizeSliderValue] = useState<number>(3);
    const handleSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSizeSliderValue(Number(e.target.value));
    };

    const [dataInput, setDataInput] = useState("");

    function handleDataChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDataInput(value);

        // convert "1,2,3" → [1,2,3]
        const arr = value
            .split(",")
            .map(v => parseInt(v.trim()));
            // .filter(v => !isNaN(v));

        onDataChange(arr);
    }

    return (
        <div id="left-panel" className="panel">
            <div className="bar panel-bar" id="left-panel-bar">Controls</div>
            <div className="left-panel-content panel-content">
                <span>Data Structure</span>
                <select name="struct-select"
                    id="struct-select"
                    className="dropdown"
                    value={structure}
                    onChange={
                        (e) => {
                            setStructure(e.target.value as StructureType)
                        }}>
                    <option value="array">Array</option>
                    <option value="list">Linked List</option>
                    <option value="stack" disabled>Stack</option>
                    <option value="queue" disabled>Queue</option>
                    <option value="tree">Tree</option>
                </select>

                <span>Algorithm</span>
                <select name="algo-select" id="algo-select" className="dropdown">
                    <option value="insertion">Insertion</option>
                    <option value="deletion">Deletion</option>
                    <option value="linear search">Linear Search</option>
                    <option value="binary search">Binary Search</option>
                </select>

                <hr />

                <div className="input-field">
                    <label>Data</label> <input className="input" name="array-value" id="array-value" value={dataInput} onChange={handleDataChange} disabled={isAnimating}/>
                    <label>Index</label> <input className="input" type="number" name="array-index" id="array-index" />
                </div>
                <div className="left-panel-button-container">
                    <Button text="Insert" className="left-panel-button" />
                    <Button className="left-panel-button" text="Random" /><Button className="left-panel-button" text="Clear" />

                </div>

                <hr />
                <div className="input-field">
                    <label>Size: {sizeSliderValue}</label>
                    <input type="range" className="size-slider" min={1} max={5} value={sizeSliderValue} onChange={handleSizeSliderChange} />

                </div>

            </div>
        </div>
    )
}