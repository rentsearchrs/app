import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
export interface Realtor {
  id: number;
  name: string;
  username: string;
  apartments: any[]; // This assumes apartments is always an array
}

export interface TeamLeaderRealtorsResponse {
  team_leader_id: number;
  realtors: Realtor[];
}
@Injectable({
  providedIn: 'root'
})
export class TeamLeaderService {
  private baseUrl = 'https://lviv-pject.vercel.app';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage!');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getTeamLeaders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/team_leaders/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getRealtorsByTeamLeader(teamLeaderId: number): Observable<TeamLeaderRealtorsResponse> {
    return this.http.get<TeamLeaderRealtorsResponse>(`${this.baseUrl}/team_leader/${teamLeaderId}/realtors/`, {
      headers: this.getHeaders(),
    });
  }
  

  assignTeamLeader(realtorId: number, teamLeaderId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign_team_leader/`, {
      realtor_id: realtorId,
      team_leader_id: teamLeaderId
    }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('API call failed:', error);
    return throwError(() => error);
  }
}
