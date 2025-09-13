import { useApp } from "../contexts/AppContext";

export default function MockWallet() {
  const { state, setWalletConnected } = useApp();
  const mockAddress = "DemoWallet123456789012345678901234567890";

  if (!state.isWalletConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Демо режим: Мок кошелек
        </div>
        <button
          onClick={() => setWalletConnected(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Подключить мок кошелек
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
        ✅ Мок кошелек подключен
      </div>
      <div className="text-xs font-mono text-gray-600">
        {mockAddress.slice(0, 8)}...{mockAddress.slice(-8)}
      </div>
      <button
        onClick={() => setWalletConnected(false)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
      >
        Отключить
      </button>
    </div>
  );
}
