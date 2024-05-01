import { Injectable } from '@angular/core';
import {Client, Message} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  stompClient: Client;

  constructor() {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => new WebSocket('ws://localhost:9000/ws');
    this.stompClient.activate();
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.stompClient.activate();
      resolve(); // Resolves immediately as the connection is initiated
    });
  }

  sendMessage(message: string) {
    this.stompClient.publish({ destination: '/app/send-message', body: message });
    console.log("sendMessage:" + message);
  }

  subscribeToMessages(callback: (message: Message) => void) {
    console.log("subscribe und so");
    return this.stompClient.subscribe('/topic/messages', callback);
  }
}
