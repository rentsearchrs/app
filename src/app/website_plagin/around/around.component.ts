import { HttpClient } from '@angular/common/http';
import { Component,  ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-around',
  templateUrl: './around.component.html',
  styleUrl: './around.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class AroundComponent {
  isPopupOpen: boolean = false;

  constructor(private http: HttpClient) {} // Inject HttpClient

  openPopup(): void {
    this.isPopupOpen = true;
    console.log('Popup opened');
  }

  closePopup(): void {
    this.isPopupOpen = false;
    console.log('Popup closed');
  }

  onSubmitPopupForm(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
  
    const requestData: any = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email_adres: 'example@example.com', // Replace with an email input field if required
      message: formData.get('message'),
    };
  
    console.log('Form Data:', requestData);
  
    this.http.post('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/orders/', requestData).subscribe({
      next: (response) => {
        console.log('Order saved:', response);
        alert('Form submitted successfully!');
        this.closePopup();
      },
      error: (error) => {
        console.error('Error saving order:', error);
        alert('Failed to submit the form. Please try again.');
      },
    });
  }
  
}
