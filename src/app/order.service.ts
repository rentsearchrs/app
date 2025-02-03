import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { EulerOrder } from 'three';
export interface Order {
  id: number;
  name: string;
  email_adres: string;
  phone: string;
  ed_status: string;
  apartment_id: number;
}

export interface OrderStatusUpdateResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://127.0.0.1:8000'; // Base API URL
  private ordersApiUrl = `${this.baseUrl}/get_orders/`; // Endpoint for orders

  constructor(private http: HttpClient) {}

  // Get Authorization headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing. Redirecting to login.');
      throw new Error('User is not authenticated'); // Handle missing token
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch orders for a specific realtor
  getOrders(realtorId: number): Observable<Order[]> {
    const url = `${this.ordersApiUrl}?realtor_id=${realtorId}`;
    return this.http.get<Order[]>(url).pipe(catchError(this.handleError));
  }

  // Fetch all orders for a specific apartment
  getOrdersByApartment(apartmentId: number): Observable<Order[]> {
    const url = `${this.ordersApiUrl}?apartment_id=${apartmentId}`;
    return this.http.get<Order[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch orders by status
  getOrdersByStatus(status: string): Observable<Order[]> {
    const url = `${this.ordersApiUrl}?status=${status}`;
    return this.http.get<Order[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update the status of a specific order
  updateOrderStatus(orderId: number, newStatus: string): Observable<OrderStatusUpdateResponse> {
    const url = `${this.ordersApiUrl}${orderId}/status?new_status=${newStatus}`;
    return this.http.put<OrderStatusUpdateResponse>(url, null, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.handleError));
  }

  getUnassignedOrders(teamLeaderId: number): Observable<Order[]> {
    const url = `${this.baseUrl}/team_leader/orders/?team_leader_id=${teamLeaderId}`;
    return this.http.get<Order[]>(url).pipe(catchError(this.handleError));
  }

  // Fetch realtors under a team leader
  getRealtors(teamLeaderId: number): Observable<{ id: number; name: string }[]> {
    const url = `${this.baseUrl}/team_leaders/realtors?team_leader_id=${teamLeaderId}`;
    return this.http.get<{ id: number; name: string }[]>(url);
  }
  // Assign an order to a specific realtor
  assignOrder(orderId: number, realtorId: number): Observable<any> {
    const url = `${this.baseUrl}/team_leader/orders/${orderId}/assign/?realtor_id=${realtorId}`;
    return this.http.put(url, {}).pipe(catchError(this.handleError));
  }
  getRealtorStats(teamLeaderId: number): Observable<any> {
    const url = `${this.baseUrl}/team_leader/${teamLeaderId}/realtor-stats`;
    return this.http.get<any>(url);
}
  // Fetch order statistics by agent ID
  getOrderStatistics(realtorId: number): Observable<any> {
    const url = `${this.baseUrl}/order_statistics/?realtor_id=${realtorId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }
  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('API call failed:', error);
    let errorMessage = 'An unknown error occurred. Please try again later.';
    if (error.status === 401) {
      errorMessage = 'Unauthorized access. Please log in again.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    return throwError(() => new Error(errorMessage));
  }
}