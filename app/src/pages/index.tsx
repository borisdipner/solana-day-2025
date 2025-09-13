import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../contexts/AppContext";
import MockWallet from "../components/MockWallet";
import { sdk } from "../lib/sdk";

export default function Home() {
  const { state, setDemoMode, setWalletConnected } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="font-bold text-2xl text-primary-600">SpotPass</div>
          <div className="text-sm text-gray-600">Time-Sliced Tokenization</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Демо режим:</label>
            {mounted ? (
              <input
                type="checkbox"
                checked={state.isDemoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded"
              />
            ) : (
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            )}
          </div>
          {!mounted ? (
            <div className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600">
              Загрузка...
            </div>
          ) : state.isDemoMode ? (
            <MockWallet />
          ) : (
            <WalletMultiButton />
          )}
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Токенизация времени ресурсов
          </h1>
          <p className="text-gray-600 mb-4">
            Создавайте, продавайте и управляйте временными слотами для парковочных мест и других ресурсов
          </p>
          
          {mounted && state.isDemoMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">🎬</div>
                  <div className="text-blue-800 font-medium">Демо режим активен</div>
                </div>
                <button
                  onClick={async () => {
                    await sdk.clearAllData();
                    localStorage.clear();
                    location.reload();
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  🧹 Сбросить все
                </button>
              </div>
              <div className="text-blue-700 text-sm mt-1">
                Демо режим активен
              </div>
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/create-asset" className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🏢 Создать ресурс (парковка)
            </h2>
            <p className="text-gray-600 mb-4">
              Создайте новый ресурс для токенизации времени
            </p>
            <div className="text-primary-600 font-medium">
              Перейти к созданию →
            </div>
          </Link>
          
          <Link href="/create-slice" className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ⏰ Нарезать временной слот
            </h2>
            <p className="text-gray-600 mb-4">
              Создайте временные слоты для вашего ресурса
            </p>
            <div className="text-primary-600 font-medium">
              Перейти к созданию →
            </div>
          </Link>
          
          <Link href="/marketplace" className="card md:col-span-2 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🛒 Маркетплейс слотов
            </h2>
            <p className="text-gray-600 mb-4">
              Просмотрите и забронируйте доступные временные слоты
            </p>
            <div className="text-primary-600 font-medium">
              Перейти к маркетплейсу →
            </div>
          </Link>
          
          <Link href="/owner-panel" className="card md:col-span-2 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              👤 Панель владельца
            </h2>
            <p className="text-gray-600 mb-4">
              Управляйте своими ресурсами и временными слотами
            </p>
            <div className="text-primary-600 font-medium">
              Перейти к панели →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
