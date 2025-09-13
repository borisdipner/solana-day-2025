import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useApp } from "../contexts/AppContext";
import { sdk } from "../lib/sdk";
import type { Slice } from "../lib/mockData";

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

export default function OwnerPanelPage() {
  const [items, setItems] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(false);
  const { state } = useApp();
  const router = useRouter();

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
    if (!state.isDemoMode && !state.isWalletConnected) {
      alert("Пожалуйста, подключите кошелек или включите демо режим");
      return;
    }
    
    try {
      await sdk.settleSlice(sliceId);
      await loadSlices();
    } catch (error) {
      console.error("Error settling slice:", error);
      alert("Ошибка при завершении слота");
    }
  };

  const handleCancel = async (sliceId: string) => {
    if (!state.isDemoMode && !state.isWalletConnected) {
      alert("Пожалуйста, подключите кошелек или включите демо режим");
      return;
    }
    
    try {
      await sdk.cancelUnstarted(sliceId);
      await loadSlices();
    } catch (error) {
      console.error("Error cancelling slice:", error);
      alert("Ошибка при отмене слота");
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
          <div className="text-sm text-gray-600">Панель владельца</div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            👤 Панель владельца
          </h1>
          
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
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Загрузка слотов...</div>
              </div>
            ) : (
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
                        disabled={slice.status !== "Reserved"}
                        onClick={() => handleSettle(slice.id)}
                      >
                        Завершить
                      </button>
                      
                      <button 
                        className="flex-1 btn-secondary disabled:opacity-40"
                        disabled={(slice.status !== "Open" && slice.status !== "Reserved")}
                        onClick={() => handleCancel(slice.id)}
                      >
                        Отменить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {items.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👤</div>
                <div>У вас пока нет слотов</div>
                <div className="text-sm">Создайте слоты в разделе выше</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
