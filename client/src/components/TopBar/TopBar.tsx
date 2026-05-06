import DarkModeIcon from "../../assets/dark-mode-icon.svg?react";
import LightModeIcon from "../../assets/light-mode-icon.svg?react";
import HelpIcon from "../../assets/help-icon.svg?react";
import { Button } from "../Button/Button.tsx"
import { useState } from "react";

export function TopBar() {
    const root = document.documentElement;
    const [mode, setMode] = useState<"light"|"dark">("dark");
    const Icon = mode === "light" ? <LightModeIcon className="icon"/> : <DarkModeIcon className="icon"/>;
    return (
        <div id="top-bar" className="bar">
            <header> AlgoViz</header>
            <Button
                text="Theme"
                icon={ Icon }
                className="top-bar-button"
                onClick={() => {
                    root.classList.toggle('light');
                    setMode(mode === "light" ? "dark" : "light");
                }}
            />
            <Button text="Help" icon={<HelpIcon className="icon" />} className="top-bar-button" />
        </div>
    )
}