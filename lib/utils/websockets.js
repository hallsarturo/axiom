export class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = {};
    }

    connect(userId, token) {
        // Skip connection if not authenticated
        if (!userId) return;

        // Build URL without null token
        const socketUrl = token
            ? `${process.env.NEXT_PUBLIC_WS_URL}/ws?userId=${userId}&token=${token}`
            : `${process.env.NEXT_PUBLIC_WS_URL}/ws?userId=${userId}`;

        try {
            this.socket = new WebSocket(socketUrl);

            // Add error handler
            this.socket.onerror = (error) => {
                console.error('WebSocket connection error:', error);
            };

            this.socket.onopen = () => {
                console.log('WebSocket connected');
            };

            this.socket.onmessage = (event) => {
                try {
                    // Add validation before parsing
                    if (
                        !event.data ||
                        typeof event.data !== 'string' ||
                        event.data.trim() === ''
                    ) {
                        console.log(
                            'Received empty or invalid WebSocket message'
                        );
                        return;
                    }

                    const message = JSON.parse(event.data);
                    if (message.type && this.listeners[message.type]) {
                        this.listeners[message.type].forEach((callback) =>
                            callback(message.data)
                        );
                    }
                } catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                    // For debugging during development:
                    console.log(
                        'Raw message received:',
                        typeof event.data,
                        event.data.substring(0, 100)
                    );
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
                // Reconnect after 5 seconds
                setTimeout(() => this.connect(userId, token), 5000);
            };
        } catch (err) {
            console.error('Failed to create WebSocket connection:', err);
        }
    }

    addEventListener(type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    removeEventListener(type, callback) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter(
                (cb) => cb !== callback
            );
        }
    }

    disconnect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
            console.log('WebSocket disconnected manually');
        }
    }

    sendChatMessage(recipientId, content) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(
                JSON.stringify({
                    type: 'chat',
                    data: {
                        recipientId,
                        content,
                    },
                })
            );
        }
    }

    sendNotification(recipientId, notificationType, entityId, content) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(
                JSON.stringify({
                    type: 'notification',
                    data: {
                        recipientId,
                        notificationType,
                        entityId,
                        content,
                    },
                })
            );
        }
    }
}

export const webSocketService = new WebSocketService();

export async function testWSConnection() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/ws-test`
        );
        const data = await response.json();
        console.log('WebSocket server status:', data);
        return data;
    } catch (err) {
        console.error('WebSocket server not reachable:', err);
        return { status: 'error', message: err.message };
    }
}
