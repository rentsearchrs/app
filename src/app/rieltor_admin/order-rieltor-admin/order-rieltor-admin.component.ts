import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Order, OrderService } from '../../order.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-rieltor-admin',
  templateUrl: './order-rieltor-admin.component.html',
  styleUrl: './order-rieltor-admin.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class OrderRieltorAdminComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const realtorId = this.authService.getAgentId(); // Fetch realtor ID from AuthService
    if (realtorId === null) {
      this.router.navigate(['/login']); // Redirect to login if realtorId is null
      return;
    }
    this.fetchOrders(realtorId);
  }

  fetchOrders(realtorId: number): void {
    this.loading = true;
    this.orderService.getOrders(realtorId).subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.loading = false;
        this.errorMessage = null;
      },
      (error: any) => {
        this.loading = false;
        if (error.status === 403) {
          this.errorMessage = 'Access denied: You are not authorized to view these orders.';
        } else if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to fetch orders. Please try again later.';
        }
      }
    );
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      () => {
        const updatedOrder = this.orders.find(order => order.id === orderId);
        if (updatedOrder) {
          updatedOrder.ed_status = newStatus;
        }
      },
      (error: any) => {
        console.error('Error updating order status:', error);
        this.errorMessage = 'Failed to update order status. Please try again.';
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'badge badge-pending';
      case 'Processing':
        return 'badge badge-processing';
      case 'Completed':
        return 'badge badge-completed';
      case 'Canceled':
        return 'badge badge-canceled';
      default:
        return 'badge badge-secondary';
    }
  }
}