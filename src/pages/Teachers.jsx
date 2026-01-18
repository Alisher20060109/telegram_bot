import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Teachers({ setIsLogin }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobil sidebar uchun

  // O'qituvchilar state-i
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Alisher Ro'ziyev", subject: "Matematika", phone: "+998 90 053 50 16", status: "Active" },
    { id: 2, name: "Malika Axmedova", subject: "Ingliz tili", phone: "+998 93 765 43 21", status: "Active" },
    { id: 3, name: "Javohir Toirov", subject: "Dasturlash", phone: "+998 99 000 11 22", status: "Inactive" },
  ]);

  // Yangi o'qituvchi uchun state
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "", phone: "" });

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    if (setIsLogin) setIsLogin(false);
    toast.info("Tizimdan chiqildi");
    navigate("/");
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const teacherToAdd = {
      ...newTeacher,
      id: Date.now(),
      status: "Active"
    };
    setTeachers([...teachers, teacherToAdd]);
    setIsModalOpen(false);
    setNewTeacher({ name: "", subject: "", phone: "" });
    toast.success("Yangi o'qituvchi qo'shildi");
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast.error("O'qituvchi o'chirildi");
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar - Desktop va Mobil uchun */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-6 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300`}>
        <h1 className="text-2xl font-bold text-amber-500 mb-10">Admin Panel</h1>
        <nav className="flex flex-col gap-4">
          <div className="bg-amber-500/10 text-amber-500 p-3 rounded-lg font-medium cursor-pointer">O'qituvchilar</div>
          <div className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-all text-gray-400">O'quvchilar</div>
          <div className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-all text-gray-400">Dars jadvali</div>
        </nav>
      </div>

      {/* Asosiy qism */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-600 text-2xl">☰</button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 truncate">O'qituvchilar boshqaruvi</h2>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium transition-colors text-sm md:text-base">Chiqish</button>
        </header>

        <main className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Qidirish..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5">🔍</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>+</span> Yangi qo'shish
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">O'QITUVCHI</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">FAN</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">TELEFON</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">STATUS</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">AMAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">{t.name.charAt(0)}</div>
                        <span className="font-medium text-gray-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.subject}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{t.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-amber-600 mr-4 transition-colors">✏️</button>
                      <button onClick={() => deleteTeacher(t.id)} className="text-gray-400 hover:text-red-600 transition-colors">🗑️</button>
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
          <form onSubmit={handleAddTeacher} className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Yangi o'qituvchi</h3>
            <div className="space-y-4">
              <input required type="text" placeholder="To'liq ismi" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              <input required type="text" placeholder="Fani" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} />
              <input required type="tel" placeholder="Telefon raqami" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all">Bekor qilish</button>
                <button type="submit" className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-lg transition-all">Saqlash</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}