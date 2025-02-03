import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class ItemPageComponent implements OnInit {
  product: any = null; // Holds the fetched product data
  recommendations: any[] = []; // Holds random recommended apartments

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); // Get the product ID from the route
    if (productId) {
      this.fetchProduct(productId);
      this.fetchRandomRecommendations();
    }
  }

  fetchProduct(id: string): void {
    const apiUrl = `http://127.0.0.1:8000/get_apartment_and_photo/${id}/`;
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.product = data; // Assign the fetched product to the `product` variable
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  fetchRandomRecommendations(): void {
    const apiUrl = `http://127.0.0.1:8000/get_orders_and_photo/`;
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.recommendations = this.getRandomItems(data, 5); // Fetch 5 random items
        console.log('Random Recommendations:', this.recommendations);
      },
      (error) => {
        console.error('Error fetching random recommendations:', error);
      }
    );
  }

  getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}