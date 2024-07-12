import React, { useEffect, useState } from "react";
import { getRoot } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRoot().then((data) => setMessage(data.Hello));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">{message}</h1>
    </div>
  );
}

export default App;
