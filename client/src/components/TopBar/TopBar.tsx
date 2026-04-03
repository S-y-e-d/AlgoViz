import ResetIcon from "../../assets/reset-icon.svg?react";
import DarkModeIcon from "../../assets/dark-mode-icon.svg?react";
import HelpIcon from "../../assets/help-icon.svg?react";
import { Button } from "../Button/Button.tsx"

export function TopBar() {
    return (
        <div id="top-bar" className="bar">
            <header>AlgoViz</header>
            <Button text="Reset" icon={<ResetIcon className="icon" />} className="top-bar-button"/>
            <Button text="Theme" icon={<DarkModeIcon className="icon" />} className="top-bar-button"/>
            <Button text="Help" icon={<HelpIcon className="icon" />} className="top-bar-button"/>
            {/* <div id="reset-button"> <ResetIcon className="icon"/> Reset </div> */}
            {/* <div id="theme-button"> <DarkModeIcon className="icon"/> Theme </div> */}
            {/* <img src="" /> */}
        </div>
    )
}