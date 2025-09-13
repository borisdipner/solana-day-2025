
# SpotPass — Time-Sliced Tokenization MVP (Solana)

> **Кейс 2: Токенизация Assets.** Время как актив: парковочные слоты, нарезанные на тайм‑интервалы. MVP: Anchor-программа (моки эскроу), Next.js фронт с кошельком, демо‑скрипты, презентация.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Установка зависимостей для фронтенда
cd app
npm install

# Возвращаемся в корень для Anchor
cd ..
```

### 2. Запуск фронтенда

```bash
cd app
npm run dev
```

Откройте http://localhost:3000 и подключите Phantom кошелек (devnet).

### 3. Сборка Anchor программы

```bash
# В корне проекта
anchor build
```

## 📁 Структура проекта

```
spotpass/
├── README.md
├── Anchor.toml
├── package.json
├── programs/
│   └── spotpass_core/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs
├── app/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── src/
│   │   ├── pages/
│   │   │   ├── _app.tsx
│   │   │   └── index.tsx
│   │   ├── components/
│   │   │   ├── WalletBar.tsx
│   │   │   ├── CreateAsset.tsx
│   │   │   ├── CreateSlice.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   └── OwnerPanel.tsx
│   │   ├── lib/
│   │   │   ├── sdk.ts
│   │   │   └── mockData.ts
│   │   └── styles.css
│   └── public/
└── scripts/
    ├── dev-seed.ts
    ├── reserve.ts
    └── settle.ts
```

## 🎯 Функционал MVP

### Anchor программа (`spotpass_core`)

- **`initialize_asset`** — создание ресурса (парковочного места)
- **`create_time_slice`** — нарезка временных слотов
- **`reserve_slice`** — бронирование слота покупателем
- **`settle_slice`** — завершение слота после окончания времени
- **`cancel_unstarted`** — отмена не начавшегося слота

### Frontend (Next.js + Wallet Adapter)

- **Создание ресурса** — владелец создает парковочное место
- **Нарезка слотов** — создание временных интервалов с ценами
- **Маркетплейс** — просмотр и бронирование доступных слотов
- **Панель владельца** — управление своими слотами
