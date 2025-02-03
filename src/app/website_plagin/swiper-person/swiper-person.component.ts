import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-swiper-person',
  templateUrl: './swiper-person.component.html',
  styleUrls: ['./swiper-person.component.scss'],
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class SwiperPersonComponent implements AfterViewInit {
  realtors: any[] = []; // Holds realtor data

  constructor(private http: HttpClient) {
    // Load external scripts dynamically
    this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js');
    this.loadScript('https://cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js');
  }

  ngAfterViewInit(): void {
    this.fetchRealtors(); // Fetch realtor data
  }

  loadScript(src: string): void {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => console.log(`Script loaded: ${src}`);
    document.body.appendChild(script);
  }

  fetchRealtors(): void {
    const apiUrl = 'http://127.0.0.1:8000/realtors/'; // API endpoint
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.realtors = data;
        this.initializeSlickCarousel(); // Initialize carousel after data is loaded
      },
      (error) => console.error('Error fetching realtors:', error)
    );
  }

  initializeSlickCarousel(): void {
    setTimeout(() => {
      if (typeof $ !== 'undefined') {
        ($('.center_carousel') as any).slick({
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 3,
          variableWidth: true,
        });
      } else {
        console.error('jQuery not loaded yet.');
      }
    }, 1000); // Delay ensures jQuery is loaded
  }
}