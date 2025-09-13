import { useState } from "react";
import { useRouter } from "next/router";
import { useApp } from "../contexts/AppContext";
import { sdk } from "../lib/sdk";

export default function CreateSlicePage() {
  const [asset, setAsset] = useState("ASSET1");
  const [start, setStart] = useState(Math.floor(Date.now() / 1000) + 3600);
  const [end, setEnd] = useState(Math.floor(Date.now() / 1000) + 7200);
  const [price, setPrice] = useState(10_000_000);
  const [loading, setLoading] = useState(false);
  const { state, addSlice } = useApp();
  const router = useRouter();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleCreate = async () => {
    if (!state.isDemoMode && !state.isWalletConnected) {
      alert("Пожалуйста, подключите кошелек или включите демо режим");
      return;
    }
    
    if (end <= start) {
      alert("Время окончания должно быть позже времени начала");
      return;
    }
    
    setLoading(true);
    try {
      const res = await sdk.createSlice(asset, start, end, price);
      addSlice(res.sliceId);
      alert(`Слот создан! Slice ID: ${res.sliceId}`);
      router.push('/');
    } catch (error) {
      console.error("Error creating slice:", error);
      alert("Ошибка при создании слота");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Назад
          </button>
          <div className="font-bold text-2xl text-primary-600">SpotPass</div>
          <div className="text-sm text-gray-600">Создание слота</div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            ⏰ Нарезать временной слот
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset PDA
              </label>
              <input 
                className="input-field" 
                value={asset} 
                onChange={e => setAsset(e.target.value)} 
                placeholder="ASSET1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Используйте созданные ресурсы: {state.createdAssets.join(', ') || 'ASSET1'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Начало (Unix timestamp)
                </label>
                <input 
                  className="input-field" 
                  type="number"
                  value={start} 
                  onChange={e => setStart(parseInt(e.target.value))} 
                  placeholder="startTs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(start)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Окончание (Unix timestamp)
                </label>
                <input 
                  className="input-field" 
                  type="number"
                  value={end} 
                  onChange={e => setEnd(parseInt(e.target.value))} 
                  placeholder="endTs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(end)}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (lamports)
              </label>
              <input 
                className="input-field" 
                type="number"
                value={price} 
                onChange={e => setPrice(parseInt(e.target.value))} 
                placeholder="10000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                {price / 1_000_000} SOL
              </p>
            </div>
            
            <button 
              className="btn-primary w-full" 
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Создание..." : "Добавить слот"}
            </button>
            
            {state.createdSlices.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-2">
                  ✅ Созданные слоты:
                </div>
                {state.createdSlices.map((slice, index) => (
                  <div key={index} className="text-xs font-mono text-green-700">
                    {slice}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
