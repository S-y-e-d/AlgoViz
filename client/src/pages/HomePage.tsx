import { Link } from "react-router-dom";
function HomePage() {

    return (
        <div className="home-page">
            <header>AlgoViz</header>
            <span>Explore and Visualize data structures and algorithms step by step.</span>
            <div className="cards">
                    <Link to="/viz" className="card">Launch Visualizer</Link>
                    <Link to="/sandbox" className="card">Launch Sandbox</Link>
            </div>
        </div>
    )
}

export default HomePage;