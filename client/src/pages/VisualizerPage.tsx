import { useEffect, useRef, useState } from "react";
import { LeftPanel } from "../components/LeftPanel/LeftPanel.tsx";
import { CenterPanel } from "../components/CenterPanel/CenterPanel.tsx";
import { RightPanel } from "../components/RightPanel/RightPanel.tsx";
import { TopBar } from "../components/TopBar/TopBar.tsx"
import { BottomBar } from "../components/BottomBar/BottomBar.tsx"
import type { DataItem, StructureType } from "../App.tsx";

export const VisualizerPage = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);
  console.log(msg);

  // input box data to set the middle structure values 
  const [data, setData] = useState<DataItem[]>([]);

  const refreshData = () => {
    const temp = data.map((item) => item.val);
    onDataChange(temp);
  }

  const onDataChange = (array: number[]) => {
    setData([]);
    const items: DataItem[] = array.map((n) => ({
      id: crypto.randomUUID(),
      val: n,
    }));
    setData(items);
  }

  const [structure, setStructure] = useState<StructureType>("array");



  const nodeRefs = useRef<Map<number, SVGGElement>>(new Map());

  
  const isTLPaused = useRef<boolean>(true);
  const setTLPaused = (b: boolean) => {
    isTLPaused.current = b;
    console.log(isTLPaused.current);
  }

  return (
    <div className="visualizer-page">
      <div className="layout">
        <div className="top"><TopBar /></div>
        <div className="middle">
          <div className="left-panel">
            <LeftPanel
              onDataChange={onDataChange}
              structure={structure}
              setStructure={setStructure}
            />
          </div>
          <div className="center-panel">
            <CenterPanel
              data={data}
              structure={structure}
              nodeRefs={nodeRefs}
            /></div>
          <div className="right-panel"><RightPanel /></div>
        </div>
        <div className="bottom">
          <BottomBar
            data={data}
            nodeRefs={nodeRefs}
            isTLPaused={isTLPaused}
            setTLPaused={setTLPaused}
            refreshData={refreshData}
          /></div>
      </div>
    </div>
  )
}
