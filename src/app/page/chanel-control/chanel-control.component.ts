import { Component, OnInit } from '@angular/core';
import { ChanelAdminService } from '../../chanel-admin.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chanel-control',
  templateUrl: './chanel-control.component.html',
  styleUrl: './chanel-control.component.css'
})
export class ChanelControlComponent implements OnInit {
  channels: any[] = [];
  category: string = '';
  typeDeal: string = '';
  channelId: string = '';
  typeObject: string = '';
  priceFrom?: number;
  priceTo?: number;
  locationType: string = 'all';  // Default to 'all'
  private apiUrl = 'https://lviv-pject.vercel.app/';  // Your FastAPI backend URL
  categories = ['sent to telegram channel', 'successful'];
  typeDeals = ['kvartiry', 'doma', 'posutochno-pochasovo'];
  typeObjects = ['posutochno-pochasovo-doma', 'posutochno-pochasovo-kvartiry', 'dolgosrochnaya-arenda-kvartir', 'arenda-domov', 'prodazha-kvartir', 'prodazha-domov'];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getChannels();
  }

  // ✅ Fetch all channels directly from FastAPI
  getChannels(): void {
    this.http.get(`${this.apiUrl}/telegram_channels`).subscribe(
      (data: any) => this.channels = data,
      (error) => console.error('Error fetching channels:', error)
    );
  }

  addChannel(): void {
    if (!this.category || !this.typeDeal || !this.channelId) {
      alert('All fields are required!');
      return;
    }
  
    const newChannel = {
      category: this.category,
      type_deal: this.typeDeal,
      type_object: this.typeObject,
      channel_id: this.channelId,
      price_from: this.priceFrom || null, // Ensure numeric or null
      price_to: this.priceTo || null,     // Ensure numeric or null
      location_type: this.locationType || 'all',
    };
  
    this.http.post(`${this.apiUrl}/telegram_channels`, newChannel).subscribe(
      () => {
        alert('Channel added successfully!');
        this.getChannels();
        this.clearForm();
      },
      (error) => {
        if (error.error?.error?.includes('already exists')) {
          alert('A channel with this category already exists!');
        } else {
          console.error('Error adding channel:', error);
        }
      }
    );
  }


  // ✅ Delete a channel by ID
  deleteChannel(channelId: number): void {
    this.http.delete(`${this.apiUrl}/telegram_channels/${channelId}`).subscribe(
      () => {
        alert('Channel deleted successfully!');
        this.getChannels();  // Refresh the list
      },
      (error) => console.error('Error deleting channel:', error)
    );
  }

  // ✅ Clear the form after adding
  clearForm(): void {
    this.category = '';
    this.typeDeal = '';
    this.typeObject = '';
    this.channelId = '';
    this.priceFrom = undefined; // Reset filtering fields
    this.priceTo = undefined;
    this.locationType = 'all';
  }
}
