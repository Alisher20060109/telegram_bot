import React, { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; // Yo'lni tekshiring: src/pages/LoginPage.jsx
import Teachers from "./pages/Teachers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  // Sahifa yangilanganda ham login holatini saqlab qolish uchun localStorage'dan o'qiymiz
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  return (
    <BrowserRouter>
      {/* Toast xabarlari ko'rinishi uchun */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Agar login qilgan bo'lsa va / ga kirsab, uni /teachers ga yuboramiz */}
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

        {/* Himoyalangan yo'l: faqat login bo'lganda kirish mumkin */}
        <Route 
          path="/teachers" 
          element={isLogin ? <Teachers /> : <Navigate to="/" />} 
        />

        {/* Noto'g'ri yo'l kiritilsa Login'ga qaytarish */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}