import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../order.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-team-lead',
  templateUrl: './order-team-lead.component.html',
  styleUrl: './order-team-lead.component.css'
})
export class OrderTeamLeadComponent implements OnInit {
  unassignedOrders: Order[] = [];
  realtors: { id: number; name: string }[] = []; // List of realtors to assign orders
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const teamLeaderId = this.authService.getAgentId();
    if (!teamLeaderId) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchUnassignedOrders(teamLeaderId);
    this.fetchRealtors(teamLeaderId);
  }

  fetchUnassignedOrders(teamLeaderId: number): void {
    this.orderService.getUnassignedOrders(teamLeaderId).subscribe(
      (data: Order[]) => {
        this.unassignedOrders = data;
      },
      (error: any) => {
        console.error('Error fetching unassigned orders:', error);
        this.errorMessage = 'Failed to fetch unassigned orders. Please try again later.';
      }
    );
  }

  fetchRealtors(teamLeaderId: number): void {
    this.orderService.getRealtors(teamLeaderId).subscribe(
      (data: { id: number; name: string }[]) => {
        this.realtors = data;
      },
      (error: any) => {
        console.error('Error fetching realtors:', error);
        this.errorMessage = 'Failed to fetch realtors. Please try again later.';
      }
    );
  }

  assignOrder(orderId: number, realtorId: string): void {
    const realtorIdNumber = parseInt(realtorId, 10); // Convert string to number
    if (isNaN(realtorIdNumber)) {
      this.errorMessage = 'Invalid realtor selected. Please try again.';
      return;
    }

    this.orderService.assignOrder(orderId, realtorIdNumber).subscribe(
      () => {
        this.unassignedOrders = this.unassignedOrders.filter((order) => order.id !== orderId);
      },
      (error: any) => {
        console.error('Error assigning order:', error);
        this.errorMessage = 'Failed to assign order. Please try again.';
      }
    );
  }
}