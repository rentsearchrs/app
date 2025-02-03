import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { OrderService } from '../../order.service';
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit{
  isBrowser: boolean;
  dailyChartData: any = null;
  weeklyChartData: any = null;
  monthlyChartData: any = null;
  adStatusChartData: any = null;
  dailyOrderStats: any = null;
  weeklyOrderStats: any = null;
  monthlyOrderStats: any = null;
  chartOptions: any;
  agentId: number | null = null;
  apiUrl: string;
  apartmentStats: any = {
    daily: {},
    weekly: {},
    monthly: {},
    adStatus: {},
  };

  constructor(
    private orderService: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.apiUrl = `http://127.0.0.1:8000/agents/${this.authService.getAgentId()}/apartments`;
  }

  ngOnInit(): void {
    this.agentId = this.authService.getAgentId();
    if (this.isBrowser && this.agentId) {
      this.fetchStatistics();
      this.fetchOrderStatistics();
      setTimeout(() => {
        console.log('Application stabilized.');
      }, 100);
    }
  }

  fetchStatistics(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      data => {
        this.processData(data);
        this.initializeCharts();
      },
      error => console.error('Error fetching data:', error)
    );
  }

  fetchOrderStatistics(): void {
    if (!this.agentId) {
        console.error('Agent ID is missing.');
        return;
    }

    this.orderService.getOrderStatistics(this.agentId).subscribe(
        (data) => {
            // Ensure data is not null before processing
            if (!data || typeof data !== 'object') {
                console.warn('Invalid order data received from API.');
                return;
            }

            const validDailyData = this.validateAndParseData(data.daily || {});
            const validWeeklyData = this.validateAndParseData(data.weekly || {});
            const validMonthlyData = this.validateAndParseData(data.monthly || {});

            this.dailyOrderStats = this.generateChartData(validDailyData, 'Daily Order Stats');
            this.weeklyOrderStats = this.generateChartData(validWeeklyData, 'Weekly Order Stats');
            this.monthlyOrderStats = this.generateChartData(validMonthlyData, 'Monthly Order Stats');
        },
        (error) => console.error('Failed to fetch order statistics:', error)
    );
}

validateAndParseData(data: any): { [key: string]: number } {
  const parsedData: { [key: string]: number } = {};
  if (!data || typeof data !== 'object') {
      console.warn('Invalid data format received');
      return parsedData;
  }

  for (const [key, value] of Object.entries(data)) {
      const numericValue = Number(value);  // Convert to number
      if (!isNaN(numericValue)) {
          parsedData[key] = numericValue;
      } else {
          console.warn(`Invalid numeric value for key: ${key}`);
      }
  }
  return parsedData;
}
generateChartData(data: any, label: string) {
  if (!data || Object.keys(data).length === 0) {
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

  // Use the keys as labels without modifying them
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


  processData(apartments: any[]): void {
    if (!apartments || apartments.length === 0) {
      console.warn('No apartments found.');
      return;
    }

    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const dailyCounts: { [key: string]: number } = {};
    const weeklyCounts: { [key: string]: number } = {};
    const monthlyCounts: { [key: string]: number } = {};
    const adStatusCounts: { [key: string]: number } = {};

    apartments.forEach(apartment => {
      const locationDate = new Date(Date.parse(apartment.last_contact_date));
      const dayDiff = Math.floor((today.getTime() - locationDate.getTime()) / oneDay);

      if (dayDiff >= 0 && dayDiff < 7) {
        const dayLabel = this.getDayLabel(locationDate);
        dailyCounts[dayLabel] = (dailyCounts[dayLabel] || 0) + 1;
      }

      const weekDiff = this.getWeekDifference(locationDate, today);
      if (weekDiff >= 1 && weekDiff <= 3) {
        const weekLabel = `Week ${weekDiff}`;
        weeklyCounts[weekLabel] = (weeklyCounts[weekLabel] || 0) + 1;
      }

      const monthDiff = this.getMonthDifference(locationDate, today);
      if (monthDiff >= 0 && monthDiff < 12) {
        const monthLabel = this.getMonthLabel(locationDate);
        monthlyCounts[monthLabel] = (monthlyCounts[monthLabel] || 0) + 1;
      }

      const status = apartment.ad_status || 'unknown';
      adStatusCounts[status] = (adStatusCounts[status] || 0) + 1;
    });

    this.apartmentStats = { daily: dailyCounts, weekly: weeklyCounts, monthly: monthlyCounts, adStatus: adStatusCounts };
  }

  getDayLabel(date: Date): string {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  }

  getMonthLabel(date: Date): string {
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  getWeekDifference(startDate: Date, endDate: Date): number {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  }

  getMonthDifference(startDate: Date, endDate: Date): number {
    return endDate.getFullYear() * 12 + endDate.getMonth() - (startDate.getFullYear() * 12 + startDate.getMonth());
  }

  initializeCharts(): void {
    this.dailyChartData = this.generateChartData(this.apartmentStats.daily, 'Processed Apartments (Last 7 Days)');
    this.weeklyChartData = this.generateChartData(this.apartmentStats.weekly, 'Processed Apartments (Previous 3 Weeks)');
    this.monthlyChartData = this.generateChartData(this.apartmentStats.monthly, 'Processed Apartments (Last 12 Months)');

    this.adStatusChartData = {
      labels: Object.keys(this.apartmentStats.adStatus),
      datasets: [{
        label: 'Ad Status Distribution',
        data: Object.values(this.apartmentStats.adStatus),
        backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }]
    };
    this.chartOptions = { responsive: true, maintainAspectRatio: false };
  }
}
