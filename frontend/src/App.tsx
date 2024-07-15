import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItineraryForm from "./components/ItineraryForm";
import ResultsPage from "./components/ResultsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow pt-24 pb-8 px-4 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<ItineraryForm />} />
            <Route path="/results/:taskId" element={<ResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
