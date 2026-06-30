"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'bartender' | 'inventory' | 'delivery'>('home');
  
  const [queue, setQueue] = useState<any[]>([]);
  const [served, setServed] = useState<any[]>([]);
  const [pendingReview, setPendingReview] = useState<any[]>([]);
  const [pendingPayment, setPendingPayment] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      if (activeTab === 'home') {
        const reviewData = await fetchWithAuth("/admin/users/pending-review");
        setPendingReview(reviewData);
        const paymentData = await fetchWithAuth("/admin/users/pending-payment");
        setPendingPayment(paymentData);
      } else if (activeTab === 'bartender') {
        const qData = await fetchWithAuth("/admin/bartender/queue");
        setQueue(qData);
      } else if (activeTab === 'delivery') {
        const servedData = await fetchWithAuth("/admin/bartender/served");
        setServed(servedData);
      } else if (activeTab === 'inventory') {
        const invData = await fetchWithAuth("/inventory");
        setInventory(invData);
      }
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    let interval: any;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadData();
        interval = setInterval(loadData, 5000);
      }
    });
    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const handleApproveRegistration = async (id: string) => {
    try {
      await fetchWithAuth(`/admin/users/${id}/approve-registration`, { method: "PUT" });
      loadData();
    } catch (e: any) {
      alert("Approve Failed: " + e.message);
    }
  };

  const handleConfirmPayment = async (id: string) => {
    try {
      await fetchWithAuth(`/admin/users/${id}/confirm-payment`, { method: "PUT" });
      loadData();
    } catch (e: any) {
      alert("Confirm Failed: " + e.message);
    }
  };

  const serveOrder = async (orderId: string) => {
    await fetchWithAuth(`/admin/bartender/serve/${orderId}`, { method: "PUT" });
    loadData();
  };

  const doneOrder = async (orderId: string) => {
    await fetchWithAuth(`/admin/bartender/done/${orderId}`, { method: "PUT" });
    loadData();
  };

  const skipOrder = async (orderId: string) => {
    if (!confirm("確定要將這杯作廢跳過嗎？")) return;
    await fetchWithAuth(`/admin/bartender/skip/${orderId}`, { method: "PUT" });
    loadData();
  };

  const toggleStock = async (drinkName: string, inStock: boolean) => {
    await fetchWithAuth(`/inventory/${drinkName}`, { 
      method: "PUT",
      body: JSON.stringify({ inStock })
    });
    loadData();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* 頂部導覽列 */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">← 回首頁</Link>
            <h2 className="text-xl font-bold text-gold">老奶奶酒會 - 管理系統</h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded font-bold ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>首頁審核</button>
            <button onClick={() => setActiveTab('bartender')} className={`px-4 py-2 rounded font-bold ${activeTab === 'bartender' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>即時調酒</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded font-bold ${activeTab === 'inventory' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>庫存管理</button>
            <button onClick={() => setActiveTab('delivery')} className={`px-4 py-2 rounded font-bold ${activeTab === 'delivery' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>送達管理</button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {error && <p className="text-red-400 bg-red-900/30 p-4 rounded mb-6 border border-red-800">{error}</p>}

        {/* 標籤頁 1: 首頁審核 */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-300">需要初審的報名</h3>
              {pendingReview.length === 0 && <p className="text-gray-500">目前沒有需要初審的用戶</p>}
              <ul className="space-y-3">
                {pendingReview.map(u => (
                  <li key={u._id} className="border border-gray-700 p-4 bg-gray-800 rounded flex justify-between items-center">
                    <span>{u.nickname} <span className="text-sm text-gray-400">({u.email})</span></span>
                    <button onClick={() => handleApproveRegistration(u._id)} className="bg-blue-600 px-3 py-1 rounded font-bold hover:bg-blue-700">通過初審</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-green-300">等待對帳</h3>
              {pendingPayment.length === 0 && <p className="text-gray-500">目前沒有需要對帳的用戶</p>}
              <ul className="space-y-3">
                {pendingPayment.map(u => (
                  <li key={u._id} className="border border-gray-700 p-4 bg-gray-800 rounded flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span>{u.nickname}</span>
                      <button onClick={() => handleConfirmPayment(u._id)} className="bg-green-600 px-3 py-1 rounded font-bold hover:bg-green-700">確認收款</button>
                    </div>
                    <div className="text-sm text-gray-400 bg-gray-900 p-2 rounded">
                      截圖/末五碼: <span className="text-white">{u.paymentScreenshotUrl}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 標籤頁 2: 即時調酒 (大按鈕) */}
        {activeTab === 'bartender' && (
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-3xl font-bold mb-8 text-amber-500 border-b border-gray-800 pb-4">即時調酒佇列</h3>
            {queue.length === 0 && <p className="text-xl text-gray-500 text-center py-12">目前沒有等待中的訂單 休息一下吧！</p>}
            <div className="space-y-6">
              {queue.map((group, idx) => (
                <div key={idx} className="border-2 border-gray-700 p-6 bg-gray-800 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div>
                    <h4 className="text-5xl font-black text-white flex items-center gap-4">
                      {group.drinkName} 
                      {group.count > 1 && (
                        <span className="text-black bg-gold px-4 py-2 rounded-lg text-3xl font-black">x {group.count}</span>
                      )}
                    </h4>
                    <div className="text-xl text-gray-400 mt-4">
                      訂購人: <span className="text-gray-200">{group.orders.map((o: any) => o.userId?.nickname).join(", ")}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => serveOrder(group.orders[0]._id)}
                    className="w-full md:w-auto bg-amber-600 text-white px-12 py-6 rounded-2xl text-4xl font-black hover:bg-amber-700 shadow-2xl active:scale-95 transition-transform"
                  >
                    出杯
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 標籤頁 3: 庫存管理 */}
        {activeTab === 'inventory' && (
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-3xl font-bold mb-8 text-purple-400 border-b border-gray-800 pb-4">庫存管理</h3>
            {inventory.length === 0 && <p className="text-gray-500">載入中...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map(inv => (
                <div key={inv._id} className="border-2 border-gray-700 p-6 bg-gray-800 rounded-2xl flex flex-col justify-between items-center gap-6">
                  <h4 className="text-3xl font-black text-white">{inv.drinkName}</h4>
                  <div className="flex w-full gap-2">
                    <button 
                      onClick={() => toggleStock(inv.drinkName, true)}
                      className={`flex-1 py-4 rounded-xl text-xl font-bold transition ${inv.inStock ? 'bg-green-600 text-white border-2 border-green-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      還有
                    </button>
                    <button 
                      onClick={() => toggleStock(inv.drinkName, false)}
                      className={`flex-1 py-4 rounded-xl text-xl font-bold transition ${!inv.inStock ? 'bg-red-600 text-white border-2 border-red-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      沒有
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 標籤頁 4: 送達管理 (大按鈕) */}
        {activeTab === 'delivery' && (
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-3xl font-bold mb-8 text-emerald-400 border-b border-gray-800 pb-4">送達與作廢管理</h3>
            {served.length === 0 && <p className="text-xl text-gray-500 text-center py-12">目前沒有待送達的飲料</p>}
            <div className="space-y-6">
              {served.map(order => (
                <div key={order._id} className="border-2 border-gray-700 p-6 bg-gray-800 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div>
                    <h4 className="text-4xl font-black text-white">{order.drinkName}</h4>
                    <div className="text-xl text-gray-400 mt-2">
                      訂購人: <span className="text-emerald-300 font-bold">{order.userId?.nickname || '未知'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => doneOrder(order._id)}
                      className="flex-1 sm:flex-none bg-emerald-600 text-white px-10 py-6 rounded-2xl text-3xl font-black hover:bg-emerald-700 shadow-xl active:scale-95 transition-transform"
                    >
                      送達
                    </button>
                    <button 
                      onClick={() => skipOrder(order._id)}
                      className="flex-1 sm:flex-none bg-red-800 text-white px-8 py-6 rounded-2xl text-2xl font-bold hover:bg-red-700 shadow-xl active:scale-95 transition-transform"
                    >
                      作廢跳過
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
