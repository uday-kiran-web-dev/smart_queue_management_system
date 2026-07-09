import { useEffect } from "react";
import toast from "react-hot-toast";

export default function useQueueSocket(onMessage) {
  useEffect(() => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    // Convert HTTP URL to WebSocket URL by replacing protocol
    const wsURL = baseURL.replace(/^https?:\/\//, (match) => {
      return match.startsWith("https") ? "wss://" : "ws://";
    });

    const socketURL = `${wsURL}/api/v1/ws`;

    const socket = new WebSocket(socketURL);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("[WebSocket] Parse error:", error);
      }
    };

    socket.onerror = () => {
      toast.error("WebSocket connection failed");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [onMessage]);
}
