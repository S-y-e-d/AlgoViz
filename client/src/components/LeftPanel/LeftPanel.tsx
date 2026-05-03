import { useState } from "react"
import { Button } from "../Button/Button"
import type { AlgoType, StructureType } from "../../App";

type LeftPanelProps = {
    onDataChange: (data: number[]) => void;
    valueData: number;
    setValueData: (n: number) => void;
    indexData: number;
    setIndexData: (n: number) => void;
    structure: StructureType;
    setStructure: (structure: StructureType) => void;
    algorithm: AlgoType;
    setAlgorithm: (algo: AlgoType) => void;
    setSize: (n: number) => void;
};

export function LeftPanel({
    onDataChange,
    valueData,
    setValueData,
    indexData,
    setIndexData,
    structure,
    setStructure,
    algorithm,
    setAlgorithm,
    setSize }: LeftPanelProps
) {

    const [sizeSliderValue, setSizeSliderValue] = useState<number>(3);
    const handleSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = Number(e.target.value);
        setSizeSliderValue(size);
        setSize(25 + size * 25);
    };

    // temporary default data input
    // const tempData = [6, 3, 4, 1, 8, 7, 2, 5];
    const [dataInput, setDataInput] = useState("");

    function handleDataChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDataInput(value);

        // convert "1,2,3" → [1,2,3]
        const arr = value
            .split(",")
            .map(v => parseInt(v.trim()));

        onDataChange(arr);
    }


    let targetValue = null;
    const targetValueAlgorithms = ["insertion", "binary-search", "linear-search"];
    if (targetValueAlgorithms.includes(algorithm)) {
        targetValue = <input
            className="input"
            type="number"
            name="target-value"
            id="target-value"
            placeholder="Value"
            value={valueData === 0 ? "" : valueData}
            onChange={e => setValueData(Number(e.target.value))}
        />;
    }
    let targetIndex = null;
    const targetIndexAlgorithms = ["deletion", "insertion",];
    if (targetIndexAlgorithms.includes(algorithm)) {
        targetIndex = <input
            className="input"
            type="number"
            name="target-index"
            id="target-index"
            placeholder="Index"
            value={indexData === 0 ? "" : indexData}
            onChange={e => setIndexData(Number(e.target.value))}
        />
    }

    const [randomizeSize, setRandomizeSize] = useState<number>(0);
    const randomizeData = () => {

        let arr;
        if (algorithm === "binary-search") {
            let prev = 0;
            arr = [];
            for (let i = 0; i < randomizeSize; i++) {
                const num = prev + Math.round(Math.random()+1);
                arr.push(num);
                prev = num;
            }
        } else {
            arr = Array.from({ length: randomizeSize }, (_, i) => i + 1);
            // Fisher–Yates shuffle
            for (let i = randomizeSize - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }

        }
        setDataInput(arr.join(","));
        onDataChange(arr);

    }

    const clearData = () => {
        setDataInput("");
        onDataChange([]);
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
                    onChange={(e) => setStructure(e.target.value as StructureType)}>
                    <option value="array">Array</option>
                    <option value="list">Linked List</option>
                    <option value="stack" disabled>Stack</option>
                    <option value="queue" disabled>Queue</option>
                    <option value="tree">Tree</option>
                </select>

                <span>Algorithm</span>
                <select name="algo-select"
                    id="algo-select"
                    className="dropdown"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as AlgoType)}
                >
                    <option value="insertion">Insertion</option>
                    <option value="deletion">Deletion</option>
                    <option value="linear-search">Linear Search</option>
                    <option value="binary-search">Binary Search</option>
                    <option value="bubble-sort">Bubble Sort</option>
                    <option value="selection-sort">Selection Sort</option>
                    <option value="insertion-sort">Insertion Sort</option>
                </select>

                <hr />

                <div className="input-field-container">
                    <input
                        className="input"
                        name="array-value"
                        id="array-value"
                        value={dataInput}
                        onChange={handleDataChange}
                        placeholder="Data"
                    />
                    <div className="optional-input-fields">
                        {targetValue}
                        {targetIndex}
                    </div>
                </div>
                <div className="left-panel-button-container">
                    <div className="random-container">
                        <Button text="Randomize" className="left-panel-button" onClick={randomizeData} />
                        <input
                            type="number"
                            className="input"
                            placeholder="Size"
                            value={randomizeSize === 0 ? "" : randomizeSize}
                            onChange={e => setRandomizeSize(Number(e.target.value))} />
                    </div>
                    <Button className="left-panel-button" text="Clear" onClick={clearData} />

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