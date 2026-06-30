"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const data = await fetchWithAuth("/orders/my-orders");
      setOrders(data);

      const invData = await fetchWithAuth("/inventory");
      setInventory(invData);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadOrders();
      }
    });
    return () => unsubscribe();
  }, []);

  const orderDrink = async (drinkName: string) => {
    try {
      await fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify({ drinkName }),
      });
      loadOrders();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen p-8 text-white font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← 回首頁</Link>
        <h2 className="text-3xl font-bold mb-8 text-gold border-b border-gray-800 pb-4">點酒後台</h2>
        
        {error && <p className="text-red-400 bg-red-900/30 p-4 rounded mb-6 border border-red-800">{error}</p>}
        
        <div className="mb-8 p-6 border border-gray-800 rounded-lg bg-gray-900 shadow-xl">
          <h3 className="font-bold text-xl mb-4 text-gray-200">快速點酒</h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { name: "夏日回憶", classStr: "bg-blue-600 hover:bg-blue-700 text-white" },
              { name: "命運", classStr: "bg-amber-600 hover:bg-amber-700 text-white" },
              { name: "猛毒9502", classStr: "bg-purple-600 hover:bg-purple-700 text-white" },
              { name: "機會", classStr: "bg-pink-600 hover:bg-pink-700 text-white" },
              { name: "房地產", classStr: "bg-orange-600 hover:bg-orange-700 text-white" },
              { name: "短島冰茶", classStr: "bg-amber-800 hover:bg-amber-900 text-white" },
              { name: "環遊世界", classStr: "bg-emerald-600 hover:bg-emerald-700 text-white" }
            ].map(drink => {
              const inv = inventory.find(i => i.drinkName === drink.name);
              const inStock = inv ? inv.inStock : true;
              return (
                <button 
                  key={drink.name}
                  disabled={!inStock}
                  onClick={() => orderDrink(drink.name)} 
                  className={`px-4 py-2 rounded font-bold transition ${
                    inStock 
                      ? drink.classStr
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {drink.name} {!inStock && "(已售完)"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 border border-gray-800 rounded-lg bg-gray-900 shadow-xl">
          <h3 className="font-bold text-xl mb-4 text-gray-200">我的訂單紀錄</h3>
          {orders.length === 0 && <p className="text-gray-500">尚無訂單記錄</p>}
          <ul className="space-y-3">
            {orders.map(o => (
              <li key={o._id} className="border border-gray-700 p-4 flex justify-between items-center rounded bg-gray-800">
                <span className="font-bold text-lg">{o.drinkName}</span>
                <span className={`font-bold px-3 py-1 rounded text-sm ${
                  o.status === 'QUEUE' ? 'bg-yellow-900 text-yellow-300' :
                  o.status === 'MAKING' ? 'bg-blue-900 text-blue-300' :
                  o.status === 'SERVED' ? 'bg-green-900 text-green-300' :
                  o.status === 'DONE' ? 'bg-emerald-700 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {o.status === 'SERVED' ? '待送達' : o.status === 'DONE' ? '已送達' : o.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
