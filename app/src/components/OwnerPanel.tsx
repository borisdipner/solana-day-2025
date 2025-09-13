import { useEffect, useState } from "react";
import { sdk } from "../lib/sdk";
import type { Slice } from "../lib/mockData";
import { useWallet } from "@solana/wallet-adapter-react";

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Open": return "bg-green-100 text-green-800";
    case "Reserved": return "bg-yellow-100 text-yellow-800";
    case "Settled": return "bg-blue-100 text-blue-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case "Open": return "🟢";
    case "Reserved": return "🟡";
    case "Settled": return "🔵";
    case "Cancelled": return "🔴";
    default: return "⚪";
  }
}

export default function OwnerPanel() {
  const [items, setItems] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(false);
  const { connected } = useWallet();

  const loadSlices = async () => {
    setLoading(true);
    try {
      const slices = await sdk.listSlices();
      setItems(slices);
    } catch (error) {
      console.error("Error loading slices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlices();
  }, []);

  const handleSettle = async (sliceId: string) => {
    try {
      await sdk.settleSlice(sliceId);
      await loadSlices();
    } catch (error) {
      console.error("Error settling slice:", error);
      alert("Ошибка при завершении слота");
    }
  };

  const handleCancel = async (sliceId: string) => {
    try {
      await sdk.cancelUnstarted(sliceId);
      await loadSlices();
    } catch (error) {
      console.error("Error cancelling slice:", error);
      alert("Ошибка при отмене слота");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Загрузка слотов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Ваши слоты: {items.length}
        </div>
        <button 
          className="btn-secondary text-sm"
          onClick={loadSlices}
        >
          🔄 Обновить
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(slice => (
          <div key={slice.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="font-semibold text-gray-800">
                Слот {slice.id}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slice.status)}`}>
                {getStatusEmoji(slice.status)} {slice.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="text-gray-600">
                <div className="font-medium">Время:</div>
                <div>{formatTime(slice.startTs)}</div>
                <div className="text-gray-400">↓</div>
                <div>{formatTime(slice.endTs)}</div>
              </div>
              
              <div className="text-gray-600">
                <div className="font-medium">Цена:</div>
                <div className="font-semibold text-primary-600">
                  {slice.priceLamports / 1_000_000} SOL
                </div>
              </div>
              
              {slice.buyer && (
                <div className="text-gray-600">
                  <div className="font-medium">Покупатель:</div>
                  <div className="text-xs font-mono break-all">
                    {slice.buyer}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                className="flex-1 btn-primary disabled:opacity-40"
                disabled={slice.status !== "Reserved" || !connected}
                onClick={() => handleSettle(slice.id)}
              >
                Завершить
              </button>
              
              <button 
                className="flex-1 btn-secondary disabled:opacity-40"
                disabled={(slice.status !== "Open" && slice.status !== "Reserved") || !connected}
                onClick={() => handleCancel(slice.id)}
              >
                Отменить
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👤</div>
          <div>У вас пока нет слотов</div>
          <div className="text-sm">Создайте слоты в разделе выше</div>
        </div>
      )}
    </div>
  );
}
