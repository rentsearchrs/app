import { Component } from '@angular/core';

@Component({
  selector: 'app-create-requast',
  templateUrl: './create-requast.component.html',
  styleUrl: './create-requast.component.css'
})
export class CreateRequastComponent    {
  currentStep = 1;

  cities = ['New York', 'Los Angeles', 'Chicago'];
  operations = ['Rent', 'Sale'];
  currencies = ['USD', 'EUR', 'GBP'];

  formData: any = {
    city: '',
    operation: '',
    district: '',
    street: '',
    rooms: null,
    area: null,
    floor: null,
    totalFloors: null,
    price: null,
    currency: '',
    name: '',
    phone: '',
    survey: '',
    professionalShooting: false,
    photos: [],
  };

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 10) {
      alert('You can only upload up to 10 photos.');
    } else {
      this.formData.photos = files;
    }
  }

  onSubmit() {
    console.log('Form Submitted:', this.formData);
    alert('Form submitted successfully!');
  }
}