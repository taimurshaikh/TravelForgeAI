import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItineraryForm from "./components/ItineraryForm";
import ResultsPage from "./components/ResultsPage";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<ItineraryForm />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
