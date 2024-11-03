import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import HomePage from "./components/HomePage.jsx";

function App() {
  return (
      <Routes>
        <Route>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
  );
}

export default App;
