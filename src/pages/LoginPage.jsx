import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage({ setIsLogin }) {
  // Login yoki Register holatini boshqarish
  const [isRegister, setIsRegister] = useState(false);

  // Form maydonlari
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Ro'yxatdan o'tish (Ma'lumotlarni saqlash)
  const handleRegister = (e) => {
    e.preventDefault();
    const userData = { firstName, lastName, email, password };
    
    // Ma'lumotlarni localStorage'ga "user" kaliti bilan saqlaymiz
    localStorage.setItem("registeredUser", JSON.stringify(userData));
    
    toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kiring.");
    setIsRegister(false); // Kirish oynasiga qaytaramiz
  };

  // Tizimga kirish (Saqlangan ma'lumot bilan tekshirish)
  const handleLogin = (e) => {
    e.preventDefault();
    
    // LocalStorage'dan saqlangan foydalanuvchini olamiz
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
      localStorage.setItem("isLogin", "true");
      setIsLogin(true);
      toast.success(`Xush kelibsiz, ${savedUser.firstName}!`);
      navigate("/teachers");
    } else {
      toast.error("Email yoki parol noto'g'ri yoki siz hali ro'yxatdan o'tmagansiz!");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-indigo-600 to-purple-800 flex justify-center items-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-lg mx-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isRegister ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="flex flex-col gap-4">
          
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Ismingiz"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-500 outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Familiyangiz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Elektron pochta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-500 outline-none transition-all"
            required
          />

          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-500 outline-none transition-all"
            required
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 w-full py-4 rounded-xl text-white text-xl font-bold transition-all shadow-lg active:scale-95 mt-2"
          >
            {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isRegister ? "Profilingiz bormi?" : "Profilingiz yo'qmi?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 font-bold hover:underline"
            >
              {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}