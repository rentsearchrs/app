import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private apiUrl = 'https://lviv-pject.vercel.app/get_orders_and_photo_all/';
  private norm = 'https://lviv-pject.vercel.app'
  private BASE_URL = 'https://lviv-pject.vercel.app';

  constructor(private http: HttpClient) { }
  getTrapWords() {
    return this.http.get<string[]>('https://lviv-pject.vercel.app/admin/get_traps');
  }

  getStopWords() {
    return this.http.get<string[]>('https://lviv-pject.vercel.app/admin/get_stop_words');
  }

  getVerificationAds() {
    return this.http.get<any[]>('https://lviv-pject.vercel.app/admin/verification_ads');
  }

  addTrapWord(word: string) {
    return this.http.post('https://lviv-pject.vercel.app/admin/add_trap/', { word });
  }

  removeTrapWord(word: string) {
    return this.http.delete(`https://lviv-pject.vercel.app/admin/remove_trap/${word}`);
  }

  approveApartment(id: number) {
    return this.http.put(`https://lviv-pject.vercel.app/admin/verify_ad/${id}`, { decision: "relevant" });
  }

  rejectApartment(id: number) {
    return this.http.put(`https://lviv-pject.vercel.app/admin/verify_ad/${id}`, { decision: "spam" });
  }

  runParser() {
    return this.http.post('https://lviv-pject.vercel.app/admin/run_parser/', {});
  }

  runAutoPosting() {
    return this.http.post('https://lviv-pject.vercel.app/admin/start_auto_posting/', {});
  }

  getApartments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  autoAssignApartments() {
    return this.http.post(`${this.BASE_URL}/assign_apartments/auto`, {});
  }
  getApartmentsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`https://lviv-pject.vercel.app/apartments/${status}`);
  }
  // Delete Image
  deleteImage(imageId: number): Observable<any> {
    return this.http.delete<any>(`https://lviv-pject.vercel.app/images/${imageId}`);
  }  
  // Upload New Image
  uploadImage(apartmentId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${apartmentId}/upload_image`, formData);
  }
  updateImageOrder(imageId: number, order: number): Observable<any> {
    return this.http.put(`/images/${imageId}/order`, { order });
  }
  reorderImages(apartmentId: number, orderUpdates: { image_id: number; new_order: number }[]): Observable<any> {
    return this.http.put(`${this.BASE_URL}/apartments/${apartmentId}/reorder_images`, orderUpdates);
  }
  updateApartmentFixFields(apartmentId: number, updateData: any): Observable<any> {
    const url = `https://lviv-pject.vercel.app/apartments/${apartmentId}/update_fix_fields`;
    return this.http.put<any>(url, updateData);
  
  }
  updateApartmentStatus(apartmentId: number, newStatus: string): Observable<any> {
    return this.http.put(
        `https://lviv-pject.vercel.app/get_orders_and_photo_all/${apartmentId}/status?new_status=${newStatus}`,
        {}
    );
  }

  getDistrictsAndCities(): Observable<{ districts: string[], citiesByDistrict: { [district: string]: string[] } }> {
    return this.getApartments().pipe(
      map(data => {
        const districts = new Set<string>();
        const citiesByDistrict: { [district: string]: string[] } = {};

        data.forEach((apartment: any) => {
          const locationParts = apartment.location_date.split(', ');
          const district = locationParts[0];
          const city = locationParts[1] || '';

          districts.add(district);
          if (!citiesByDistrict[district]) {
            citiesByDistrict[district] = [];
          }
          if (city && !citiesByDistrict[district].includes(city)) {
            citiesByDistrict[district].push(city);
          }
        });

        return {
          districts: Array.from(districts),
          citiesByDistrict
        };
      })
    );
  }
  getTemplates(): Observable<any> {
    return this.http.get(`${this.norm}/templates`);
}

createTemplate(data: any): Observable<any> {
    return this.http.post(`${this.norm}/templates`, data);
}

updateTemplate(templateId: number, data: any): Observable<any> {
    return this.http.put(`${this.norm}/templates/${templateId}`, data);
}

deleteTemplate(templateId: number): Observable<any> {
    return this.http.delete(`${this.norm}/templates/${templateId}`);
}

publishToChannel(apartmentId: number, templateName: string): Observable<any> {
  // Correct URL for the endpoint
  const url = `${this.norm}/get_orders_and_photo/publish_to_channel/${apartmentId}?template_name=${templateName}`;
  return this.http.post(url, null).pipe(
      catchError(error => {
          console.error("Error publishing to channel:", error);
          return throwError(() => new Error("Failed to publish to channel."));
      })
  );
}
}
