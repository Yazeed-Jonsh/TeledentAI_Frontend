import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./Context/LangContext";
import Shell from "./components/Shell";
import Home from "./Pages/Home";
import HowPage from "./Pages/HowPage";
import Capture from "./Pages/Capture";
import Results from "./Pages/Results";
import Chat from "./Pages/Chat";
import AboutPage from "./Pages/AboutPage";

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how" element={<HowPage />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/results" element={<Results />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </LangProvider>
  );
}
