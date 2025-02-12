import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItineraryForm from "@components/ItineraryForm";
import ResultsPage from "@components/ResultsPage";
import Header from "@components/Header";
import Footer from "@components/Footer";
import ErrorBoundary from "@components/ErrorBoundary";
import { MapContainer } from "@components/MapContainer";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Header />
          <main className="flex-grow items-center pb-8 px-4 max-w-7xl mx-auto w-full">
            {/* There are two main routes in the app, each with their own component */}
            <Routes>
              <Route path="/" element={<ItineraryForm />} />
              <Route path="/results/:taskId" element={<ResultsPage />} />
              {/* <Route path="/map" element={<MapContainer />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
