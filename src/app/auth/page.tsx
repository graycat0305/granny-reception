"use client";

import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) loadProfile();
    });
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchWithAuth("/users/me");
      setProfile(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loginGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleRegister = async () => {
    if (!nickname) return alert("請輸入暱稱");
    try {
      await fetchWithAuth("/users/register", {
        method: "POST",
        body: JSON.stringify({ nickname }),
      });
      loadProfile();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-8 text-white">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← 回首頁</Link>
        <div className="max-w-md mx-auto text-center bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-gold">登入酒會</h2>
          <button onClick={loginGoogle} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-bold">
            使用 Google 登入
          </button>
        </div>
      </div>
    );
  }

  const handleUploadScreenshot = async () => {
    if (!screenshotUrl) return alert("請貼上截圖網址或輸入末五碼");
    try {
      await fetchWithAuth("/users/payment", {
        method: "PUT",
        body: JSON.stringify({ screenshotUrl }),
      });
      loadProfile();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Profile.registered is explicitly set to false in the backend if not found
  if (profile && profile.registered === false) {
    return (
      <div className="min-h-screen p-8 text-white">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← 回首頁</Link>
        <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-gold">您尚未報名</h2>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">請設定您的暱稱</label>
            <input 
              className="border border-gray-700 bg-gray-800 p-3 rounded w-full text-white placeholder-gray-500 focus:border-gold outline-none" 
              value={nickname} 
              placeholder="例如：王小明"
              onChange={(e) => setNickname(e.target.value)} 
            />
          </div>
          <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-3 rounded-lg w-full font-bold hover:bg-green-700">
            送出報名
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white">
      <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← 回首頁</Link>
      <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">歡迎, <span className="text-gold">{profile?.nickname}</span></h2>
        <p className="text-lg text-gray-300 mb-6">目前狀態: <strong className={profile?.status === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}>{profile?.status}</strong></p>
        
        {profile?.status === 'PENDING_REVIEW' && (
          <div className="mt-4 p-4 border border-blue-700 rounded bg-blue-900/30 text-left mb-6">
            <p className="text-blue-200 text-sm">您的報名已送出，正在等待管理員初步審核。</p>
          </div>
        )}

        {profile?.status === 'PENDING_PAYMENT' && (
          <div className="mt-4 p-4 border border-yellow-700 rounded bg-yellow-900/30 text-left mb-6">
            <p className="text-yellow-200 text-sm mb-4">報名初審已核准！請收取 Email 並依照指示轉帳，完成後在此上傳截圖（或貼上末五碼）。</p>
            <input 
              className="border border-gray-700 bg-gray-800 p-2 rounded w-full text-white placeholder-gray-500 outline-none mb-3" 
              value={screenshotUrl} 
              placeholder="截圖網址或帳號末五碼"
              onChange={(e) => setScreenshotUrl(e.target.value)} 
            />
            <button onClick={handleUploadScreenshot} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-bold hover:bg-blue-700">
              確認送出
            </button>
          </div>
        )}

        {profile?.status === 'PAYMENT_UPLOADED' && (
          <div className="mt-4 p-4 border border-purple-700 rounded bg-purple-900/30 text-left mb-6">
            <p className="text-purple-200 text-sm">付款資訊已上傳，等待管理員進行最後對帳。</p>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-6">
          {profile?.status === 'APPROVED' ? (
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
              前往點酒
            </Link>
          ) : (
            <button disabled className="bg-gray-600 text-gray-400 px-6 py-2 rounded-lg font-bold cursor-not-allowed">
              尚未獲得點酒權限
            </button>
          )}
          <button onClick={() => auth.signOut()} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            登出
          </button>
        </div>
      </div>
    </div>
  );
}
