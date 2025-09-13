import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletBar() {
  const { publicKey, connected } = useWallet();
  
  return (
    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
      {connected ? (
        <div>
          <div className="font-medium text-green-700">✅ Кошелек подключен</div>
          <div className="text-xs font-mono break-all">
            {publicKey?.toBase58()}
          </div>
        </div>
      ) : (
        <div className="text-orange-600">
          ⚠️ Кошелек не подключен
        </div>
      )}
    </div>
  );
}
