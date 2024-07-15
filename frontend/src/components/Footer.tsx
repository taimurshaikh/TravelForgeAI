import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-gray-600 text-center py-2 text-sm shadow-sm z-50">
      <p>
        Taimur Shaikh {new Date().getFullYear()}. Powered by{" "}
        <a
          href="https://tavily.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          Tavily
        </a>
      </p>
    </footer>
  );
};

export default Footer;
