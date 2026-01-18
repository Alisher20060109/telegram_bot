import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; 
import Teachers from "./pages/Teachers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route 
          path="/" 
          element={
            !isLogin ? (
              <LoginPage setIsLogin={setIsLogin} />
            ) : (
              <Navigate to="/teachers" />
            )
          } 
        />
        <Route 
          path="/teachers" 
          element={isLogin ? <Teachers setIsLogin={setIsLogin} /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}