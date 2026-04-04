import { useEffect, useState } from "react";
import {LeftPanel} from "../components/LeftPanel/LeftPanel.tsx";
import {CenterPanel} from "../components/CenterPanel/CenterPanel.tsx";
import {RightPanel} from "../components/RightPanel/RightPanel.tsx";
import {TopBar} from "../components/TopBar/TopBar.tsx"
import {BottomBar} from "../components/BottomBar/BottomBar.tsx"

export const VisualizerPage = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);
  console.log(msg);

  // return <h1>{msg}</h1>;
  return (
    <div className="visualizer-page">
      <div className="layout">
        <div className="top"><TopBar/></div>
        <div className="middle">
          <div className="left-panel"><LeftPanel/></div>
          <div className="center-panel"><CenterPanel/></div>
          <div className="right-panel"><RightPanel/></div>
        </div>
        <div className="bottom"><BottomBar/></div>
      </div>
    </div>
  )
}
