import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      console.log('❌ No token available for WebSocket');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';
      const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
      const wsHost = API_URL.replace(/^https?:\/\//, '').replace('/api', '');
      const wsUrl = `${wsProtocol}://${wsHost}/ws?token=${token}`;
      console.log('🔌 Attempting WebSocket connection to:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected successfully');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.log('❌ WebSocket error (non-critical):', error);
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
      };

    } catch (error) {
      console.log('❌ WebSocket connection failed (non-critical):', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token]);

  return {
    ws: wsRef.current,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    send: (message) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      }
    },
    close: () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  };
}; 