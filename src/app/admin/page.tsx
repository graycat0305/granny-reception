"use client";

import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface Guest {
  id: string;
  name: string;
  hasTicket: boolean;
  hasAttended: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Camera handling
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Guest list state
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<'scanner' | 'list'>('scanner');

  const fetchGuests = async () => {
    try {
      const res = await fetch('/api/admin/guests');
      const data = await res.json();
      if (data.success) {
        setGuests(data.guests);
      }
    } catch (err) {
      console.error("Failed to fetch guests", err);
    }
  };

  useEffect(() => {
    // Check local storage for persistent login
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === process.env.NEXT_PUBLIC_ADMIN_USER && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setUsername('');
    setPassword('');
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
        fetchGuests(); // Refresh list immediately after successful scan
      } else {
        setScanResult({ success: false, message: `❌ 報到失敗：${json.message}` });
      }
    } catch (err) {
      setScanResult({ success: false, message: `❌ 發生錯誤，請重試` });
    } finally {
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

  const attendedCount = guests.filter(g => g.hasAttended).length;

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-4 mt-2">
        <h1 className="text-gold text-2xl font-serif">控制中心</h1>
        <button 
          onClick={handleLogout}
          className="text-stone-500 hover:text-stone-300 text-sm underline underline-offset-4"
        >
          登出
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 w-full max-w-md mb-6 bg-stone-900 p-1 rounded border border-stone-800">
        <button 
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-2 text-sm text-center rounded transition-colors ${activeTab === 'scanner' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-stone-500 hover:text-stone-300'}`}
        >
          掃描器
        </button>
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-sm text-center rounded transition-colors ${activeTab === 'list' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-stone-500 hover:text-stone-300'}`}
        >
          賓客名單 ({attendedCount}/{guests.length})
        </button>
      </div>
      
      {activeTab === 'scanner' && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4 px-1">
            <span className="text-stone-400 text-sm">{isCameraActive ? '相機運作中...' : '相機已關閉'}</span>
            <button 
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`px-3 py-1 rounded text-xs border transition-colors ${isCameraActive ? 'bg-red-900/30 text-red-400 border-red-500/30 hover:bg-red-900/50' : 'bg-green-900/30 text-green-400 border-green-500/30 hover:bg-green-900/50'}`}
            >
              {isCameraActive ? '關閉相機 (省電)' : '開啟相機'}
            </button>
          </div>

          <div className="w-full bg-stone-900 p-4 rounded-lg border border-gold/30 relative overflow-hidden min-h-[300px] flex items-center justify-center">
            {isCameraActive ? (
              <>
                <Scanner 
                  onScan={handleScan}
                  components={{ finder: false }}
                  allowMultiple={true}
                  scanDelay={3000}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                    <p className="text-gold animate-pulse text-lg tracking-widest font-serif">處理中...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-stone-500 text-sm flex flex-col items-center">
                <p className="mb-4">相機目前為關閉狀態</p>
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className="bg-gold/20 text-gold border border-gold/50 px-4 py-2 rounded"
                >
                  啟動掃描器
                </button>
              </div>
            )}
          </div>

          {scanResult && (
            <div className={`mt-6 p-4 rounded-lg w-full text-center text-lg shadow-lg ${scanResult.success ? 'bg-green-950/50 text-green-400 border border-green-500/30' : 'bg-red-950/50 text-red-400 border border-red-500/30'}`}>
              {scanResult.message}
            </div>
          )}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex justify-between items-end mb-4">
            <p className="text-stone-400 text-sm">已報到人數：<span className="text-gold font-bold">{attendedCount}</span></p>
            <button onClick={fetchGuests} className="text-xs text-gold border border-gold/50 rounded px-3 py-1 hover:bg-gold/10 transition-colors">
              重新整理
            </button>
          </div>

          <div className="w-full space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {guests.map((guest) => (
              <div key={guest.id} className="bg-stone-900/80 border border-stone-800 rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className={`font-serif text-lg ${guest.hasAttended ? 'text-stone-300' : 'text-white'}`}>{guest.name}</h3>
                  {guest.hasTicket && (
                    <span className="inline-block mt-1 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30">
                      🎫 實體壓克力票
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {guest.hasAttended ? (
                    <span className="text-green-500 font-bold tracking-widest border border-green-500/30 bg-green-500/10 px-2 py-1 rounded text-sm">
                      ✅ 已參加
                    </span>
                  ) : (
                    <span className="text-stone-500 text-sm">
                      ⏳ 未報到
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
