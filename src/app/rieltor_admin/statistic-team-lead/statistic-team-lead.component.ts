import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-statistic-team-lead',
  templateUrl: './statistic-team-lead.component.html',
  styleUrl: './statistic-team-lead.component.css'
})
export class StatisticTeamLeadComponent implements OnInit {
  isBrowser: boolean;
  teamLeaderId: number | null = null;
  generalStats: any = {};
  realtorStats: any[] = [];
  chartOptions: any;

  apiUrl = 'https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/team_leader';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.teamLeaderId = this.authService.getAgentId();
    if (this.teamLeaderId) {
      this.fetchCombinedTeamLeaderStats(this.teamLeaderId);
    }
  }

  fetchCombinedTeamLeaderStats(teamLeaderId: number): void {
    this.http.get(`${this.apiUrl}/${teamLeaderId}/combined-stats`).subscribe(
      (data: any) => {
        if (!data || typeof data !== 'object') {
            console.error('Invalid API response received.');
            return;
        }

        this.generalStats = data.generalStats;
        this.realtorStats = data.realtorStats.map((realtor: any) => ({
          name: realtor.name,
          chartData: this.generateChartData({
            'Total Apartments': realtor.total_apartments,
            'Total Orders': realtor.total_orders,
            'Completed Orders': realtor.completed_orders,
            'Pending Orders': realtor.pending_orders
          }, `${realtor.name}'s Stats`)
        }));

        this.initializeCharts();
      },
      (error) => {
        console.error('Error fetching combined team leader stats:', error);
      }
    );
  }

  generateChartData(data: any, label: string) {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        console.warn(`Invalid data provided for ${label}`);
        return {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    }

    return {
        labels: Object.keys(data),
        datasets: [{
            label: label,
            data: Object.values(data),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
  }

  initializeCharts(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }
}
