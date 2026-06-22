"use client";

import { useState, useEffect } from 'react';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';

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
  const devices = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

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
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
      <h1 className="text-gold text-2xl font-serif text-center mb-4 mt-2">控制中心</h1>
      
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
          {/* Camera Selection */}
          {devices.length > 0 && (
            <div className="w-full mb-4">
              <label className="block text-stone-400 text-xs mb-1 ml-1">切換相機鏡頭</label>
              <select 
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white outline-none focus:border-gold"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                <option value="">預設鏡頭 (自動判斷)</option>
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-full bg-stone-900 p-4 rounded-lg border border-gold/30 relative overflow-hidden">
            <Scanner 
              onScan={handleScan}
              components={{ finder: false }}
              constraints={selectedDeviceId ? { deviceId: selectedDeviceId } : undefined}
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                <p className="text-gold animate-pulse text-lg tracking-widest font-serif">處理中...</p>
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
