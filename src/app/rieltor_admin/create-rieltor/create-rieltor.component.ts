import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-rieltor',
  templateUrl: './create-rieltor.component.html',
  styleUrl: './create-rieltor.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class CreateRieltorComponent  implements OnInit {
  rieltorForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    name: [''],
    type: ['realtor'],
    profile_picture1: [''],
    profile_picture2: [''],
    quote: [''],
    team_leader_id: [null]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    // Form initialization moved to declaration to fix TS2564 error
  }

  onSubmit() {
    if (this.rieltorForm.valid) {
      this.http.post('https://lviv-pject.vercel.app/users', this.rieltorForm.value).subscribe({
        next: (response) => console.log('User created successfully', response),
        error: (error) => console.error('Error creating user', error),
      });
    }
  }
}
