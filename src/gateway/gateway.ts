import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*' })
export class Gateway implements OnModuleInit, OnGatewayDisconnect {
  private onlineUsers = [];

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('New connect: ', socket.id);
    });
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== client.id,
    );
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('addNewUser')
  addNewUser(@MessageBody() userId: any, @ConnectedSocket() client: Socket) {
    if (!this.onlineUsers.some((user) => user.userId === userId)) {
      this.onlineUsers.push({ userId: userId, socketId: client.id });
    }
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() message: any) {
    const user = this.onlineUsers.find(
      (user) => user.userId === message.recipientId,
    );
    if (user) {
      this.server.to(user.socketId).emit('getMessage', message);
    }
  }
}
