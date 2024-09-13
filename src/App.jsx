import { Routes, Route } from "react-router-dom";
import "./App.css";
import Pdf_Viewer from "./pages/Pdf_Viewer";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="bg-custom-bg min-h-screen text-white">
      <Navbar />
      <main className="p-4">
        <Routes>
          {/* <Route path="/" element={<Pdf_Viewer />} /> */}
          <Route path="" element={<Home />} />
          <Route path="/pdf/:qrId" element={<Pdf_Viewer />} />
        </Routes>
      </main>
    </div>
  );
}
