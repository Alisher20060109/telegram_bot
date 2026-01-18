import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Namuna uchun static ma'lumotlar
const initialTeachers = [
  { id: 1, name: "Alisher Ro'ziyev", subject: "Matematika", phone: "+998 90 053 50 16", status: "Active" },
  { id: 2, name: "Malika Axmedova", subject: "Ingliz tili", phone: "+998 93 765 43 21", status: "Active" },
  { id: 3, name: "Javohir Toirov", subject: "Dasturlash", phone: "+998 99 000 11 22", status: "Inactive" },
  { id: 4, name: "Gulnoza Karimoza", subject: "Fizika", phone: "+998 94 111 22 33", status: "Active" },
];

// App.jsx dan kelayotgan setIsLogin propsini qabul qilamiz
export default function Teachers({ setIsLogin }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    // 1. LocalStorage-ni tozalash
    localStorage.removeItem("isLogin");
    
    // 2. App.jsx-dagi state-ni false qilish (BU ENG MUHIMI)
    if (setIsLogin) {
      setIsLogin(false);
    }
    
    // 3. Xabar chiqarish va bosh sahifaga yo'naltirish
    toast.info("Tizimdan chiqildi");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-slate-900 flex-col text-white p-6">
        <h1 className="text-2xl font-bold text-amber-500 mb-10">Admin Panel</h1>
        <nav className="flex flex-col gap-4">
          <div className="bg-amber-500/10 text-amber-500 p-3 rounded-lg font-medium cursor-pointer">O'qituvchilar</div>
          <div className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-all">O'quvchilar</div>
          <div className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-all">Dars jadvali</div>
        </nav>
      </div>

      {/* Asosiy qism */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">O'qituvchilar boshqaruvi</h2>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
          >
            Chiqish
          </button>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Ism yoki fan bo'yicha qidirish..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>+</span> Yangi qo'shish
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">O'QITUVCHI</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">FAN</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">TELEFON</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">STATUS</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">AMAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {initialTeachers
                  .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.subject}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{t.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-amber-600 mr-4">✏️</button>
                      <button className="text-gray-400 hover:text-red-600">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Yangi o'qituvchi</h3>
            <div className="space-y-4">
              <input type="text" placeholder="To'liq ismi" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" />
              <input type="text" placeholder="Fani" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" />
              <input type="tel" placeholder="Telefon raqami" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all">Bekor qilish</button>
                <button className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-lg shadow-amber-500/20 transition-all">Saqlash</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}