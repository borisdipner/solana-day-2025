import { mockSlices, mockAssets, Slice, Asset } from "./mockData";

export const sdk = {
  async initializeAsset(metadataUri: string): Promise<{ assetPda: string }> {
    console.log("initialize_asset", { metadataUri });
    const newAsset: Asset = {
      id: `ASSET${mockAssets.length + 1}`,
      owner: "CurrentOwnerMock",
      metadataUri,
      createdAt: Math.floor(Date.now() / 1000)
    };
    mockAssets.push(newAsset);
    return { assetPda: newAsset.id };
  },

  async createSlice(
    asset: string, 
    startTs: number, 
    endTs: number, 
    priceLamports: number
  ): Promise<{ sliceId: string }> {
    const id = `SL${Math.floor(Math.random() * 10000)}`;
    const newSlice: Slice = {
      id,
      asset,
      startTs,
      endTs,
      priceLamports,
      status: "Open"
    };
    mockSlices.push(newSlice);
    console.log("create_slice", newSlice);
    return { sliceId: id };
  },

  async listSlices(): Promise<Slice[]> {
    return [...mockSlices];
  },

  async listAssets(): Promise<Asset[]> {
    return [...mockAssets];
  },

  async reserveSlice(id: string, buyer: string): Promise<void> {
    const s = mockSlices.find(x => x.id === id);
    if (!s) throw new Error("Slice not found");
    if (s.status !== "Open") throw new Error("Slice not open");
    s.status = "Reserved";
    s.buyer = buyer;
    console.log("reserve_slice", { id, buyer });
  },

  async settleSlice(id: string): Promise<void> {
    const s = mockSlices.find(x => x.id === id);
    if (!s) throw new Error("Slice not found");
    if (s.status !== "Reserved") throw new Error("Slice not reserved");
    s.status = "Settled";
    console.log("settle_slice", { id });
  },

  async cancelUnstarted(id: string): Promise<void> {
    const s = mockSlices.find(x => x.id === id);
    if (!s) throw new Error("Slice not found");
    if (s.status !== "Open" && s.status !== "Reserved") {
      throw new Error("Cannot cancel slice in current state");
    }
    s.status = "Cancelled";
    console.log("cancel_slice", { id });
  },

  async clearAllData(): Promise<void> {
    mockAssets.length = 0;
    mockSlices.length = 0;
    console.log("All data cleared");
  }
};
