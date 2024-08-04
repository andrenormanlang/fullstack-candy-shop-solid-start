// src/hooks/useWebSocket.ts
import { createSignal, onCleanup } from "solid-js";

export const useWebSocket = (url: string) => {
  const [ws, setWs] = createSignal<WebSocket | null>(null);
  const [message, setMessage] = createSignal<any>(null);

  const connect = () => {
    if (typeof window !== "undefined") {
      const socket = new WebSocket(url);
      setWs(socket);

      socket.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          setMessage(JSON.parse(text));
        } else {
          setMessage(JSON.parse(event.data));
        }
      };

      socket.onclose = () => {
        console.log('WebSocket closed. Reconnecting...');
        setTimeout(connect, 1000);
      };

      onCleanup(() => {
        socket.close();
      });
    }
  };

  connect();

  return [ws, message] as const;
};
