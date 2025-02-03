import { Component, OnInit } from '@angular/core';
import { Realtor, TeamLeaderService } from '../../team-leader.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-leader',
  templateUrl: './team-leader.component.html',
  styleUrl: './team-leader.component.css'
})
export class TeamLeaderComponent implements OnInit {
  realtors: Realtor[] = [];
  newRealtorId: number | null = null;

  constructor(
    private teamLeaderService: TeamLeaderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const teamLeaderId = this.authService.getAgentId();
    if (teamLeaderId) {
      this.fetchRealtors(teamLeaderId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchRealtors(teamLeaderId: number): void {
    this.teamLeaderService.getRealtorsByTeamLeader(teamLeaderId).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.realtors = (data.realtors || []).map(realtor => ({
          ...realtor,
          apartments: realtor.apartments || [] // Ensure apartments is an array
        }));
      },
      (error) => {
        console.error('Error fetching realtors:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
 

  onAssignRealtor(event: Event): void {
    event.preventDefault();
    const teamLeaderId = this.authService.getAgentId();

    if (teamLeaderId && this.newRealtorId) {
      this.teamLeaderService.assignTeamLeader(this.newRealtorId, teamLeaderId).subscribe(
        () => {
          console.log(`Realtor ${this.newRealtorId} assigned to Team Leader ${teamLeaderId}`);
          this.fetchRealtors(teamLeaderId);
        },
        (error) => {
          console.error('Error assigning realtor:', error);
        }
      );
    }
  }
}