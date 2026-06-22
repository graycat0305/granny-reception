"use client";

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified client-side check. In production, this should be server-side.
    if (username === process.env.NEXT_PUBLIC_ADMIN_USER || (username === 'admin' && password === 'admin')) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleScan = async (data: any) => {
    if (!data || isProcessing) return;
    const qrValue = data[0].rawValue;

    setIsProcessing(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: qrValue }),
      });

      const json = await res.json();
      
      if (res.ok) {
        setScanResult({ success: true, message: `✅ ${json.guestName} 已成功報到！` });
      } else {
        setScanResult({ success: false, message: `❌ 報到失敗：${json.message}` });
      }
    } catch (err) {
      setScanResult({ success: false, message: `❌ 發生錯誤，請重試` });
    } finally {
      // Cooldown before next scan
      setTimeout(() => {
        setIsProcessing(false);
      }, 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-stone-900 p-8 rounded-lg border border-gold/30 w-full max-w-sm space-y-6">
          <h1 className="text-gold text-2xl font-serif text-center mb-8">Admin Check-in</h1>
          
          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          
          <div>
            <label className="block text-stone-400 text-sm mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-stone-800 rounded p-2 text-white focus:border-gold outline-none"
            />
          </div>
          
          <div>
            <label className="block text-stone-400 text-sm mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-stone-800 rounded p-2 text-white focus:border-gold outline-none"
            />
          </div>
          
          <button type="submit" className="w-full bg-gold/20 text-gold border border-gold hover:bg-gold/30 p-2 rounded transition-colors font-serif tracking-widest mt-4">
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <h1 className="text-gold text-2xl font-serif text-center mb-6 mt-4">Scanner</h1>
      
      <div className="w-full max-w-md bg-stone-900 p-4 rounded-lg border border-gold/30 relative">
        <Scanner 
          onScan={handleScan}
          components={{ audio: false, finder: false }}
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
            <p className="text-gold animate-pulse text-lg tracking-widest">Processing...</p>
          </div>
        )}
      </div>

      {scanResult && (
        <div className={`mt-8 p-4 rounded-lg w-full max-w-md text-center text-lg ${scanResult.success ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
          {scanResult.message}
        </div>
      )}
    </div>
  );
}
