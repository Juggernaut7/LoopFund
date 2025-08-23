import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const { token } = useAuthStore();

  useEffect(() => {
    // Temporarily disable WebSocket to fix dashboard
    console.log('🔌 WebSocket temporarily disabled for dashboard fix');
    return;

    if (!token) {
      console.log('❌ No token available for WebSocket');
      return;
    }

    try {
      const wsUrl = `ws://localhost:4000/ws?token=${token}`;
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

  // Return a mock WebSocket object when disabled
  return {
    ws: wsRef.current,
    isConnected: false,
    send: () => console.log('WebSocket disabled'),
    close: () => console.log('WebSocket disabled')
  };
}; 