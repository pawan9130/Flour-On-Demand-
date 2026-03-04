import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, map } from 'rxjs';

export interface ChatMessage { sender: 'user' | 'admin'; senderId: number; text: string; timestamp: string }
export interface Chat { id?: number; orderId: number; messages: ChatMessage[] }

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:3001';
  constructor(private http: HttpClient) {}

  getChatByOrder(orderId: number): Observable<Chat[]> {
    const params = new HttpParams().set('orderId', orderId);
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`, { params });
  }

  createChat(orderId: number): Observable<Chat> {
    const chat: Chat = { orderId, messages: [] };
    return this.http.post<Chat>(`${this.apiUrl}/chats`, chat);
  }

  getOrCreateChat(orderId: number): Observable<Chat> {
    return this.getChatByOrder(orderId).pipe(
      switchMap(chats => (chats && chats.length ? of(chats[0]) : this.createChat(orderId)))
    );
  }

  appendMessage(chatId: number, message: ChatMessage): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/${chatId}`).pipe(
      switchMap(existing => {
        const updated = { ...existing, messages: [...(existing.messages || []), message] };
        return this.http.patch<Chat>(`${this.apiUrl}/chats/${chatId}`, updated);
      })
    );
  }

  appendMessageForOrder(orderId: number, message: ChatMessage): Observable<Chat> {
    return this.getOrCreateChat(orderId).pipe(
      switchMap(chat => this.appendMessage(chat.id!, message))
    );
  }
}
