"use client";

import Link from "next/link";
import DrinkMenu from "@/components/DrinkMenu";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">老奶奶酒會 4th</h1>
        <div className="flex gap-4">
          <Link href="/auth" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
            {isLoggedIn ? "進入儀表板" : "登入 / 註冊"}
          </Link>
          <Link href="/admin" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 font-bold">
            管理員後台
          </Link>
        </div>
      </header>

      <main>
        <DrinkMenu />
      </main>
    </div>
  );
}
