import { useState } from "react"
import { Button } from "../Button/Button"

export function LeftPanel() {

    const [sizeSliderValue, setSizeSliderValue] = useState<number>(3);
    const handleSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSizeSliderValue(Number(e.target.value));
    };


    return (
        <div id="left-panel" className="panel">
            <div className="bar panel-bar" id="left-panel-bar">Controls</div>
            <div className="left-panel-content panel-content">
                <span>Data Structure</span>
                <select name="struct-select" id="struct-select" className="dropdown">
                    <option value="array">Array</option>
                    <option value="linked list">Linked List</option>
                    <option value="stack">Stack</option>
                    <option value="queue">Queue</option>
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
                    <label>Value</label> <input className="input" type="number" name="array-value" id="array-value" />
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