import { useNavigate } from "react-router-dom";
import { HomeCard } from "../components/HomeCard/HomeCard.tsx";
import VisualizerImage from "../assets/visualizer-image.svg?react";
import SandboxImage from "../assets/sandbox-image.svg?react";

export const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="home-page">
            <header>AlgoViz</header>
            <span>Explore and Visualize data structures and algorithms step by step.</span>
            <div className="cards-container">
                    <HomeCard image={<VisualizerImage/>} onClick={() => navigate("/viz")}>
                    <h1>Visualizer Mode</h1>
                    <p>Follow guided, step-by-step visualizations to better understand data structures and algorithms.</p>
                    <h3>Launch Visualizer</h3>
                    </HomeCard>
                    <HomeCard image={<SandboxImage/>} onClick={() => navigate("/sandbox")}>
                    <h1>Sandbox Mode</h1>
                    <p>Experiment freely with data structures and algorithms in a flexible and interactive environment.</p>
                    <h3>Coming Soon...</h3>
                    </HomeCard>
            </div>
        </div>
    )
}
