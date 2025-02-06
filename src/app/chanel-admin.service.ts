import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChanelAdminService {
  private baseUrl = 'https://lviv-pject-git-main-rentsearchrs-projects.vercel.app';

  constructor(private http: HttpClient) {}

  addTelegramChannel(category: string, typeDeal: string, channelId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/telegram_channels/`, { category, type_deal: typeDeal, channel_id: channelId });
  }
  getApartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_orders_and_photo_all/`);
  }


  sendAdToTelegram(apartmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/apartments/${apartmentId}/send_ad`, {});
  }
}
