export type Slice = {
  id: string; 
  asset: string; 
  startTs: number; 
  endTs: number; 
  priceLamports: number; 
  status: "Open" | "Reserved" | "Settled" | "Cancelled"; 
  buyer?: string;
};

export type Asset = {
  id: string;
  owner: string;
  metadataUri: string;
  createdAt: number;
};

export const mockAssets: Asset[] = [
  {
    id: "ASSET1",
    owner: "OwnerPubkeyMock",
    metadataUri: "ipfs://QmParkingSpot1",
    createdAt: Date.now() / 1000 - 86400
  }
];

export const mockSlices: Slice[] = [
  { 
    id: "SL1", 
    asset: "ASSET1", 
    startTs: Math.floor(Date.now() / 1000) + 600, 
    endTs: Math.floor(Date.now() / 1000) + 3600, 
    priceLamports: 10000000, 
    status: "Open" 
  },
  { 
    id: "SL2", 
    asset: "ASSET1", 
    startTs: Math.floor(Date.now() / 1000) + 7200, 
    endTs: Math.floor(Date.now() / 1000) + 10800, 
    priceLamports: 12000000, 
    status: "Open" 
  },
  { 
    id: "SL3", 
    asset: "ASSET1", 
    startTs: Math.floor(Date.now() / 1000) - 7200, 
    endTs: Math.floor(Date.now() / 1000) - 3600, 
    priceLamports: 8000000, 
    status: "Reserved", 
    buyer: "BuyerPubkeyMock" 
  },
  { 
    id: "SL4", 
    asset: "ASSET1", 
    startTs: Math.floor(Date.now() / 1000) - 172800, 
    endTs: Math.floor(Date.now() / 1000) - 165600, 
    priceLamports: 15000000, 
    status: "Settled", 
    buyer: "BuyerPubkeyMock2" 
  },
  { 
    id: "SL5", 
    asset: "ASSET1", 
    startTs: Math.floor(Date.now() / 1000) + 86400, 
    endTs: Math.floor(Date.now() / 1000) + 90000, 
    priceLamports: 5000000, 
    status: "Cancelled" 
  }
];
