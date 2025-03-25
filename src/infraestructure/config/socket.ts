import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
export class SocketService {
  private io: Server;
  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log(':red_circle: Socket connection attempt without token');
        return next(new Error('Authentication error'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
          id: number;
          email: string;
        };
        socket.data.user = decoded;
        console.log(':white_check_mark: Socket authentication successful for user:', decoded.email);
        next();
      } catch (error) {
        console.log(':red_circle: Socket authentication failed:', error);
        next(new Error('Authentication error'));
      }
    });
    this.io.on('connection', (socket) => {
      const userEmail = socket.data.user?.email || 'Unknown';
      console.log(':large_green_circle: New client connected:', {
        socketId: socket.id,
        userEmail,
        timestamp: new Date().toISOString()
      });
      socket.on('subscribe_shipment', (data: { shipment_id: number }) => {
        const shipmentId = data.shipment_id;
        const room = `shipment:${shipmentId}`;
        console.log(':inbox_tray: Socket service - Received subscription request:', {
          socketId: socket.id,
          userEmail: socket.data.user?.email,
          shipmentId,
          room,
          timestamp: new Date().toISOString()
        });
        socket.join(room);
        const roomClients = this.io.sockets.adapter.rooms.get(room);
        const clientCount = roomClients ? roomClients.size : 0;
        console.log(`:white_check_mark: Socket service - Client ${socket.id} joined room:`, {
          room,
          clientCount,
          timestamp: new Date().toISOString()
        });
      });
      socket.on('unsubscribe_shipment', (data: { shipment_id: number }) => {
        const shipmentId = data.shipment_id;
        const room = `shipment:${shipmentId}`;
        console.log(':outbox_tray: Socket service - Received unsubscription request:', {
          socketId: socket.id,
          userEmail: socket.data.user?.email,
          shipmentId,
          room,
          timestamp: new Date().toISOString()
        });
        socket.leave(room);
        const roomClients = this.io.sockets.adapter.rooms.get(room);
        const clientCount = roomClients ? roomClients.size : 0;
        console.log(`:white_check_mark: Socket service - Client ${socket.id} left room:`, {
          room,
          clientCount,
          timestamp: new Date().toISOString()
        });
      });
      socket.on('disconnect', (reason) => {
        console.log(':red_circle: Client disconnected:', {
          socketId: socket.id,
          userEmail,
          reason,
          timestamp: new Date().toISOString()
        });
      });
      // Log any errors that occur on the socket
      socket.on('error', (error) => {
        console.error(':x: Socket error:', {
          socketId: socket.id,
          userEmail,
          error,
          timestamp: new Date().toISOString()
        });
      });
    });
  }
  public emitShipmentUpdate(shipmentId: number, data: any) {
    const room = `shipment:${shipmentId}`;
    const roomExists = this.io.sockets.adapter.rooms.has(room);
    const roomClients = this.io.sockets.adapter.rooms.get(room);
    const clientCount = roomClients ? roomClients.size : 0;
    console.log(':loudspeaker: Socket service - Preparing to emit shipment update:', {
      shipmentId,
      status: data.status,
      type: data.type,
      room,
      roomExists,
      clientCount,
      timestamp: new Date().toISOString()
    });
    // Emitir el evento solo si la sala existe
    if (roomExists) {
      console.log(':loudspeaker: Socket service - Room exists, emitting event to:', {
        room,
        clientCount,
        timestamp: new Date().toISOString()
      });
      this.io.to(room).emit('shipment_update', data);
      console.log(':white_check_mark: Socket service - Event emitted successfully to room:', {
        room,
        clientCount,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(':warning: Socket service - No clients subscribed to shipment:', {
        shipmentId,
        room,
        timestamp: new Date().toISOString()
      });
    }
  }
}
let socketService: SocketService;
export const initializeSocket = (server: HttpServer) => {
  console.log(':rocket: Initializing Socket.IO server');
  socketService = new SocketService(server);
  return socketService;
};
export const getSocketService = () => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};