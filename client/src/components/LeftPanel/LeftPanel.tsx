import { useState } from "react"
import { Button } from "../Button/Button"
import type { AlgoType, StructureType } from "../../App";

type LeftPanelProps = {
    onDataChange: (data: number[]) => void;
    valueData: string;
    setValueData: (n: string) => void;
    indexData: string;
    setIndexData: (n: string) => void;
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
    const targetValueAlgorithms = ["insertion", "binarySearch", "linearSearch"];
    if (targetValueAlgorithms.includes(algorithm)) {
        targetValue = <input
            className="input"
            type="number"
            name="target-value"
            id="target-value"
            placeholder="Value"
            value={valueData}
            onChange={e => setValueData(e.target.value)}
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
            value={indexData}
            onChange={e => setIndexData(e.target.value)}
        />
    }

    const [randomizeSize, setRandomizeSize] = useState<number>(0);
    const randomizeData = () => {

        let arr;
        const min = structure === "array" ? 5 : 3;
        const max = structure === "list" ? 8 : 15;
        ;
        const size = randomizeSize === 0
            ? Math.floor(Math.random() * (max - min + 1)) + min
            : randomizeSize;

        if (algorithm === "binarySearch") {
            let prev = 0;
            arr = [];
            for (let i = 0; i < size; i++) {
                const num = prev + Math.round(Math.random() + 1);
                arr.push(num);
                prev = num;
            }
        } else {
            arr = Array.from({ length: size }, (_, i) => i + 1);
            // Fisher–Yates shuffle
            for (let i = size - 1; i > 0; i--) {
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


    let options: { val: string, text: string }[] = [{ val: "NULL", text: "NULL" }];
    if (structure === "array") {
        options = [
            { val: "insertion", text: "Insertion" },
            { val: "deletion", text: "Deletion" },
            { val: "linearSearch", text: "Linear Search" },
            { val: "binarySearch", text: "Binary Search" },
            { val: "bubble Sort", text: "Bubble Sort" },
            { val: "selectionSort", text: "Selection Sort" },
            { val: "insertionSort", text: "Insertion Sort" },
            { val: "mergeSort", text: "Merge Sort" },
        ]
    } else if (structure === "list") {

        options = [
            { val: "insertion", text: "Insertion" },
            { val: "deletion", text: "Deletion" },
        ]
    } else if (structure === "tree") {
        options = [
            { val: "preorder", text: "Preorder Traversal" },
            { val: "inorder", text: "Inorder Traversal" },
            { val: "postorder", text: "Postorder Traversal" },
        ]
    } else {
        options = [{ val: "NULL", text: "NULL" }];
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
                    onChange={(e) => {
                        setStructure(e.target.value as StructureType);
                        setAlgorithm("");

                        onDataChange(dataInput.split(",")
                            .map(v => parseInt(v.trim())));


                    }}>
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
                    onChange={(e) => {
                        setAlgorithm(e.target.value as AlgoType)
                        onDataChange(dataInput.split(",")
                            .map(v => parseInt(v.trim())));
                    }
                    }
                >
                    <option value="" disabled hidden>
                        Select an algorithm
                    </option>
                    {
                        options.map((obj) => (
                            <option key={obj.val} value={obj.val} >{obj.text}</option>
                        ))
                    }
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