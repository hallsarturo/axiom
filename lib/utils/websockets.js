export class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(userId, token) {
    const socketUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws?userId=${userId}&token=${token}`;
    this.socket = new WebSocket(socketUrl);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type && this.listeners[message.type]) {
          this.listeners[message.type].forEach(callback => callback(message.data));
        }
      } catch (e) {
        console.error('Error parsing WebSocket message', e);
      }
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(userId, token), 5000);
    };
  }
  
  addEventListener(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  
  removeEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }
}

export const webSocketService = new WebSocketService();