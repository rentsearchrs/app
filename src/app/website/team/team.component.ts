import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class TeamComponent implements OnInit {
  realtors: any[] = []; // Holds the list of realtors

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRealtors();
  }

  fetchRealtors(): void {
    const apiUrl = `http://127.0.0.1:8000/realtors/`; // Replace with the actual API endpoint
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.realtors = data;
      },
      (error) => {
        console.error('Error fetching realtors:', error);
      }
    );
  }
}