"use client";

import { create } from "zustand";

// const WEBSOCKET_URI = "wss://theconnect-fa2u.onrender.com/";
const WEBSOCKET_URI = "ws://localhost:6969";

interface Store {
  socket: WebSocket | null;
  roomID: string | null;
  setSocket: (socket: WebSocket) => void;
  setRoomID: (roomID: string) => void;
  getSocket: () => WebSocket | null;
  getRoomID: () => string | null;
}

const useSocketStore = create<Store>()((set, get) => ({
  socket: null,
  roomID: null,
  setSocket: (socket) => set({ socket }),
  setRoomID: (roomID) => set({ roomID }),
  getSocket: () => get().socket,
  getRoomID: () => get().roomID,
}));

export { useSocketStore, WEBSOCKET_URI };
