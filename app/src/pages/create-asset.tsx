import { useState } from "react";
import { useRouter } from "next/router";
import { useApp } from "../contexts/AppContext";
import { sdk } from "../lib/sdk";

export default function CreateAssetPage() {
  const [uri, setUri] = useState("ipfs://QmParkingSpotMetadata");
  const [loading, setLoading] = useState(false);
  const { state, addAsset } = useApp();
  const router = useRouter();

  const handleCreate = async () => {
    if (!state.isDemoMode && !state.isWalletConnected) {
      alert("Пожалуйста, подключите кошелек или включите демо режим");
      return;
    }
    
    setLoading(true);
    try {
      const res = await sdk.initializeAsset(uri);
      addAsset(res.assetPda);
      alert(`Ресурс создан! Asset PDA: ${res.assetPda}`);
      router.push('/');
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Ошибка при создании ресурса");
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
          <div className="text-sm text-gray-600">Создание ресурса</div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🏢 Создать ресурс (парковка)
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metadata URI
              </label>
              <input 
                className="input-field" 
                value={uri} 
                onChange={e => setUri(e.target.value)} 
                placeholder="ipfs://QmYourMetadataHash"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ссылка на метаданные ресурса (IPFS, Arweave или HTTP)
              </p>
            </div>
            
            <button 
              className="btn-primary w-full" 
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать ресурс"}
            </button>
            
            {state.createdAssets.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-2">
                  ✅ Созданные ресурсы:
                </div>
                {state.createdAssets.map((asset, index) => (
                  <div key={index} className="text-xs font-mono text-green-700">
                    {asset}
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
