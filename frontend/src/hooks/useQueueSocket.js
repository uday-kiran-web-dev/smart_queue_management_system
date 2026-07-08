import { useEffect } from "react";

export default function useQueueSocket(onMessage) {
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/api/v1/ws");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      onMessage(data);
    };

    return () => {
      socket.close();
    };
  }, []);
}
