import { useState, useEffect } from "react";
import { sdk } from "../lib/sdk";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CreateSlice() {
  const [asset, setAsset] = useState("ASSET1");
  const [start, setStart] = useState(Math.floor(Date.now() / 1000) + 3600);
  const [end, setEnd] = useState(Math.floor(Date.now() / 1000) + 7200);
  const [price, setPrice] = useState(10_000_000);
  const [created, setCreated] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreate = async () => {
    if (!connected) {
      alert("Пожалуйста, подключите кошелек");
      return;
    }
    
    if (end <= start) {
      alert("Время окончания должно быть позже времени начала");
      return;
    }
    
    setLoading(true);
    try {
      const res = await sdk.createSlice(asset, start, end, price);
      setCreated(res.sliceId);
    } catch (error) {
      console.error("Error creating slice:", error);
      alert("Ошибка при создании слота");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
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
            {mounted ? formatTime(start) : "Loading..."}
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
            {mounted ? formatTime(end) : "Loading..."}
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
        disabled={loading || !connected}
      >
        {loading ? "Создание..." : "Добавить слот"}
      </button>
      
      {created && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm font-medium text-green-800 mb-1">
            ✅ Слот создан успешно!
          </div>
          <div className="text-xs font-mono text-green-700">
            Slice ID: {created}
          </div>
        </div>
      )}
    </div>
  );
}
