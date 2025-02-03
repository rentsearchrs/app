import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private agentId: number | null = null;
  private token: string | null = null;

  constructor() {
    console.log('AuthService initialized');

  }

  setAuthData(agentId: number, token: string): void {
    this.agentId = agentId;
    this.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('agentId', agentId.toString());
  }

  getAgentId(): number | null {
    return this.agentId || Number(localStorage.getItem('agentId'));
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getAuthData(): { agentId: number | null; token: string | null } {
    return {
      agentId: this.getAgentId(),
      token: this.getToken(),
    };
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(): void {
    this.agentId = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('agentId');
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      console.error('Token not found in storage.');
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
  
}