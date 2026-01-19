import React, { useState, useEffect } from "react";
import { BiEditAlt } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Firebase ulanishi
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";

// BU YERNI FIREBASE CONSOLE -> PROJECT SETTINGS'DAN OLIB TO'LDIRING
const firebaseConfig = {
  apiKey: "SIZNING_API_KEYINGIZ",
  authDomain: "admin-panel-2907d.firebaseapp.com",
  databaseURL: "https://admin-panel-2907d-default-rtdb.firebaseio.com/",
  projectId: "admin-panel-2907d",
  storageBucket: "admin-panel-2907d.appspot.com",
  messagingSenderId: "SIZNING_SENDER_ID",
  appId: "SIZNING_APP_ID"
};

// Firebase-ni ishga tushirish (faqat bir marta)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Teachers({ setIsLogin }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // O'qituvchilar state-i
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "", phone: "" });

  const BOT_TOKEN = "8511058965:AAEu8ty97TzGBhxCdF9U9s-mEtFS_dJYO2M";
  const CHAT_ID = "5744333432";

  // Telegramga xabar yuborish
  const sendToTelegram = async (message) => {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" }),
      });
    } catch (e) { console.error("Telegram error:", e); }
  };

  // REALTIME MA'LUMOTLARNI OLISH
  useEffect(() => {
    const teachersRef = ref(db, 'teachers');
    const unsubscribe = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase obyektini massivga aylantirish
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTeachers(list);
      } else {
        setTeachers([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    if (setIsLogin) setIsLogin(false);
    toast.info("Tizimdan chiqildi");
    navigate("/");
  };

  // GLOBAL QO'SHISH
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const teachersRef = ref(db, 'teachers');
      const newRef = push(teachersRef); // Yangi noyob ID yaratish

      const teacherData = {
        name: newTeacher.name,
        subject: newTeacher.subject,
        phone: newTeacher.phone,
        status: "Active"
      };

      await set(newRef, teacherData); // Bazaga yozish

      // Telegramga yuborish
      const msg = `<b>🆕 YANGI O'QITUVCHI</b>\n👤 Ism: ${newTeacher.name}\n📚 Fan: ${newTeacher.subject}\n📞 Tel: ${newTeacher.phone}`;
      await sendToTelegram(msg);

      setIsModalOpen(false);
      setNewTeacher({ name: "", subject: "", phone: "" });
      toast.success("Muvaffaqiyatli qo'shildi");
    } catch (err) {
      toast.error("Bazaga qo'shishda xatolik!");
      console.error(err);
    }
  };

  // GLOBAL O'CHIRISH
  const deleteTeacher = async (id, name) => {
    if (window.confirm(`${name}ni o'chirmoqchimisiz?`)) {
      try {
        await remove(ref(db, `teachers/${id}`));
        
        const msg = `<b>🗑 O'CHIRILDI</b>\n👤 Ism: ${name}\n❌ Ma'lumot olib tashlandi.`;
        await sendToTelegram(msg);
        
        toast.error("O'qituvchi o'chirildi");
      } catch (err) {
        toast.error("O'chirishda xato!");
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar - To'liq Responsiv */}
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
              <span className="absolute left-3 top-2.5"><IoIosSearch /></span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>+</span> Yangi qo'shish
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
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
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">{t.name?.charAt(0)}</div>
                          <span className="font-medium text-gray-800">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{t.subject}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{t.phone}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-amber-600 mr-4 transition-colors"><BiEditAlt /></button>
                        <button onClick={() => deleteTeacher(t.id, t.name)} className="text-gray-400 hover:text-red-600 transition-colors text-xl"><MdDeleteOutline /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {teachers.length === 0 && <p className="text-center p-10 text-gray-400">Hozircha ma'lumotlar yo'q...</p>}
            </div>
          </div>
        </main>
      </div>

      {/* Modal - To'liq Responsiv */}
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