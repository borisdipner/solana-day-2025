import { useState } from "react";
import { sdk } from "../lib/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDemoMode } from "../lib/useDemoMode";

export default function CreateAsset() {
  const [uri, setUri] = useState("ipfs://QmParkingSpotMetadata");
  const [assetPda, setPda] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { connected } = useWallet();
  const { isDemoMode } = useDemoMode();

  const handleCreate = async () => {
    // В демо режиме всегда разрешаем создание
    if (!connected && !isDemoMode) {
      alert("Пожалуйста, подключите кошелек");
      return;
    }
    
    setLoading(true);
    try {
      const res = await sdk.initializeAsset(uri);
      setPda(res.assetPda);
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Ошибка при создании ресурса");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        disabled={loading || (!connected && !isDemoMode)}
      >
        {loading ? "Создание..." : "Создать ресурс"}
      </button>
      
      {assetPda && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm font-medium text-green-800 mb-1">
            ✅ Ресурс создан успешно!
          </div>
          <div className="text-xs font-mono text-green-700 break-all">
            Asset PDA: {assetPda}
          </div>
        </div>
      )}
    </div>
  );
}
