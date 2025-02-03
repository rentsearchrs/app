import { Component, Input, OnChanges, OnInit, ViewEncapsulation, } from '@angular/core';
import $ from 'jquery'; // Default import for jQuery

import Swiper from 'swiper'; // Import Swiper
@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class ImageSliderComponent implements OnInit, OnChanges{
  @Input() photos: any[] = [];
  ngOnChanges(): void {
    if (this.photos?.length > 0) {
      this.initializeSwiper();
    }
  }
  ngOnInit(): void {
    // Dynamically load jQuery
    this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js').then(() => {
      console.log('jQuery loaded');
      // Dynamically load Swiper after jQuery is loaded
      return this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.8.4/swiper-bundle.min.js');
    }).then(() => {
      console.log('Swiper loaded');
      this.initializeSwiper(); // Initialize Swiper after all scripts are loaded
    }).catch(error => console.error('Error loading scripts:', error));
  }

  // Function to dynamically load external scripts
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(`Failed to load script: ${src}`);
      document.body.appendChild(script);
    });
  }

  private initializeSwiper(): void {
    $(function () {
      const galleryThumbs = new Swiper('.gallery-thumbs', {
        centeredSlides: true,
        centeredSlidesBounds: true,
        direction: 'horizontal',
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: false,
        watchSlidesProgress: true,
        watchOverflow: true,
        breakpoints: {
          480: {
            direction: 'vertical',
            slidesPerView: 3,
          },
        },
      });

      const galleryTop = new Swiper('.gallery-top', {
        direction: 'horizontal',
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        a11y: {
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
        },
        keyboard: {
          enabled: true,
        },
        thumbs: {
          swiper: galleryThumbs,
        },
      });

      galleryTop.on('slideChangeTransitionStart', function () {
        galleryThumbs.slideTo(galleryTop.activeIndex);
      });

      galleryThumbs.on('transitionStart', function () {
        galleryTop.slideTo(galleryThumbs.activeIndex);
      });
    });
  }
}