import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-product-datail',
  templateUrl: './product-datail.component.html',
  styleUrl: './product-datail.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class ProductDatailComponent implements OnInit {
  orders: any[] = [];
  selectedStatus: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {

  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      () => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
      },
      (error) => console.error('Error updating order status', error)
    );
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