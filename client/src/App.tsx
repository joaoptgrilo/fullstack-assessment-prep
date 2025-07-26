import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Route for the main page, showing the list of all polls */}
          <Route path="/" element={<PollList />} />

          {/* Route for the detail page of a specific poll */}
          {/* The ':id' is a URL parameter that we can access in the PollDetail component */}
          <Route path="/poll/:id" element={<PollDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
