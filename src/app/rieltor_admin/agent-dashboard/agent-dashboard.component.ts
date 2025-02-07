import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApartmentService } from '../../apartment.service';
interface ApartmentFile {
  id: number;
  filename: string;
  date: string;
  content_type: string;
  file_path: string;
  order: number;
}
declare var NotificationCenter: any; // Declare external JS class

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.scss',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class AgentDashboardComponent implements OnInit {
  apartments: any[] = [];
  filteredApartments: any[] = [];
  selectedStatus: string = 'All';
  notifications: string[] = [];
  selectedFile: File | null = null;
  statusOptions: string[] = ['new', 'activation_soon', 'inactive', 'successful', 'spam'];
  districts: string[] = [];
  citiesByDistrict: { [district: string]: string[] } = {};
  selectedDistricts: string[] = [];
  selectedCities: string[] = [];
  availableCities: string[] = []; 
  filterText: string = '';
  typeDeal: string = '';
  typeObject: string = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  owner: string = '';
  rooms: string = '';
  readonly UAH_TO_USD_RATE = 41.5; 
  typeDealOptions: string[] = [];
  typeObjectOptions: string[] = [];
  ownerOptions: string[] = [];
  filterById: number | null = null; 
  templates: any[] = [];
  templateTitle = '';
  templateContent = '';
  selectedTemplate: any = null;
  selectedTemplateName: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private apartmentService: ApartmentService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const agentId = localStorage.getItem('agentId');
    if (agentId) {
      this.fetchApartments(+agentId);
      this.fetchNotifications(+agentId);
    } else {
      console.error('Agent ID is missing!');
      this.router.navigate(['/login']); // Redirect to login if agent ID is missing
      this.fetchTemplates();
      this.getUniqueOptions();

    }
  }
  applyWatermark(imageId: number, apartmentId: number): void {
    const token = localStorage.getItem('token');
    this.http.put(`https://lviv-pject.vercel.app//apartments/${apartmentId}/apply_watermark/${imageId}`, {}, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe(
        () => {
            alert('Watermark applied successfully!');
            this.getAllAds();  // Refresh the list of ads
        },
        (error) => {
            console.error('Error applying watermark:', error);
        }
    );
}
removeWatermarkAI(imageId: number, apartmentId: number): void {
  const token = localStorage.getItem('token');
  this.http.put(`https://lviv-pject.vercel.app//apartments/${apartmentId}/remove_watermark_ai/${imageId}`, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }).subscribe(
      () => {
          alert('Watermark removed successfully using AI!');
          this.getAllAds();  // Refresh the list of ads
      },
      (error) => {
          console.error('Error removing watermark using AI:', error);
      }
  );
}

  addWatermarkToCanvas(imagePath: string, imageId: number): void {
    const canvas = document.getElementById(`canvas_${imageId}`) as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";  // Ensure proper CORS handling for external images
    img.src = imagePath;

    img.onload = () => {
        // Set canvas dimensions equal to the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image on the canvas
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        
        // Customize the watermark style
        ctx!.font = `${img.width * 0.1}px Arial`; // Large font size based on image width
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';  // Semi-transparent white
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        
        // Place watermark in the center
        ctx?.fillText('Watermark: CompanyName', img.width / 2, img.height / 2);
    };
  }

  getUniqueOptions(): void {
    this.typeDealOptions = this.getUniqueValues('type_deal');
    this.ownerOptions = this.getUniqueValues('owner');
    this.populateDistrictsAndCities();
  }

  fetchApartments(agentId: number): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>(`https://lviv-pject.vercel.app//agents/${agentId}/apartments/`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe(
      (data) => {
        console.log('Fetched Apartments:', data);  // Check server response
        this.apartments = data || [];
        this.filteredApartments = [...this.apartments];
        this.getUniqueOptions();
      },
      (error) => console.error('Error fetching apartments:', error)
    );
  }
  fetchNotifications(agentId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing!');
      this.router.navigate(['/login']); // Redirect if token is missing
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`https://lviv-pject.vercel.app//agents/${agentId}/notifications/`, { headers })
      .subscribe(
        (data) => {
          this.notifications = data.notifications || [];
        },
        (error) => {
          console.error('Error fetching notifications:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']); // Redirect to login if unauthorized
          }
        }
      );
  }

  markAsContacted(apartmentId: number): void {
    this.updateApartmentStatus(apartmentId, 'contacted');
  }

  archiveApartment(apartmentId: number): void {
    this.updateApartmentStatus(apartmentId, 'archived');
  }

  private updateApartmentStatus(apartmentId: number, status: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing!');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `https://lviv-pject.vercel.app//apartments/${apartmentId}/${status}`;
    this.http.put(url, {}, { headers })
      .subscribe(
        () => {
          console.log(`Apartment ${apartmentId} marked as ${status}`);
          if (status === 'archived') {
            this.apartments = this.apartments.filter(apartment => apartment.id !== apartmentId);
          } else {
            this.apartments = this.apartments.map(apartment =>
              apartment.id === apartmentId ? { ...apartment, ad_status: status } : apartment
            );
          }
        },
        (error) => {
          console.error(`Error updating apartment status to ${status}:`, error);
        }
      );
  }

  getAllAds(): void {
    console.log('Fetching all ads...');
    this.apartmentService.getApartments().subscribe(data => {
      this.apartments = data;
      this.filteredApartments = data;
    });
  }
  
  getAdsByStatus(status: string): void {
    console.log(`Fetching ads with status: ${status}`);
    this.apartmentService.getApartmentsByStatus(status).subscribe(data => {
      this.filteredApartments = data;
    });
  }
  

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadImages(event: Event, apartmentId: number): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        this.http.post(`https://lviv-pject.vercel.app//apartments/${apartmentId}/upload_images`, formData)
            .subscribe(
                () => {
                    console.log('Images uploaded with watermark successfully');
                    this.getAllAds(); // Refresh the list
                },
                (error) => {
                    console.error('Error uploading images:', error);
                }
            );
    }
}


  deleteImage(imageId: number): void {
    this.http.delete(`https://lviv-pject.vercel.app//images/${imageId}`)
      .subscribe(
        () => {
          console.log(`Image ${imageId} deleted successfully`);
          this.getAllAds();
        },
        (error) => {
          console.error('Error deleting image:', error);
        }
      );
  }

  reorderImages(event: CdkDragDrop<ApartmentFile[]>, apartmentId: number): void {
    const apartment = this.apartments.find(ap => ap.id === apartmentId);
    if (!apartment || !apartment.files) {
      console.warn('Apartment or files not found.');
      return;
    }
  
    moveItemInArray(apartment.files, event.previousIndex, event.currentIndex);
  
    // Explicitly define types for `file` and `index`
    const orderUpdates = apartment.files.map((file: ApartmentFile, index: number) => ({
      image_id: file.id,
      new_order: index,
    }));
  
    this.http.put(`https://lviv-pject.vercel.app//apartments/${apartmentId}/reorder_images`, orderUpdates)
      .subscribe(
        () => {
          console.log('Image order updated successfully');
        },
        (error) => {
          console.error('Error updating image order:', error);
        }
      );
  }
  toggleDistrictSelection(district: string): void {
    if (this.selectedDistricts.includes(district)) {
      this.selectedDistricts = this.selectedDistricts.filter(d => d !== district);
    } else {
      this.selectedDistricts.push(district);
    }
    this.selectedCities = []; // Reset cities when changing districts
    this.onFilterChange();
  }

  toggleCitySelection(city: string): void {
    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter(c => c !== city);
    } else {
      this.selectedCities.push(city);
    }
    this.onFilterChange();
  }
  updateFixFields(apartmentId: number, updateData: any): void {
    this.apartmentService.updateApartmentFixFields(apartmentId, updateData).subscribe(
      () => {
        // Refresh data or show a success message as needed
        console.log("Apartment information updated successfully.");
        this.getAllAds();  // Re-fetch apartments or update the relevant item in the list
      },
      error => {
        console.error("Error updating apartment fix fields:", error);
      }
    );
  }
  fetchTemplates(): void {
    this.apartmentService.getTemplates().subscribe(data => {
        this.templates = data;
    });
}

publishToChannel(apartmentId: number): void {
    this.apartmentService.publishToChannel(apartmentId, this.selectedTemplateName).subscribe(
        () => {
            console.log(`Apartment ${apartmentId} published successfully.`);
            alert('The ad has been published to the Telegram channel.');
        },
        (error) => {
            console.error(`Error publishing apartment ${apartmentId}:`, error);
            alert('An error occurred while publishing the ad to the channel.');
        }
    );
}

saveTemplate(): void {
    const templateData = {
        name: this.templateTitle,
        template_text: this.templateContent,
        type: "telegram_channel"  // Assuming type of template is fixed for now
    };

    if (this.selectedTemplate) {
        this.apartmentService.updateTemplate(this.selectedTemplate.id, templateData).subscribe(() => {
            this.fetchTemplates();
            this.clearForm();
        });
    } else {
        this.apartmentService.createTemplate(templateData).subscribe(() => {
            this.fetchTemplates();
            this.clearForm();
        });
    }
}

editTemplate(template: any): void {
    this.selectedTemplate = template;
    this.templateTitle = template.name;
    this.templateContent = template.template_text;
}

deleteTemplate(templateId: number): void {
    this.apartmentService.deleteTemplate(templateId).subscribe(() => {
        this.fetchTemplates();
    });
}

clearForm(): void {
    this.templateTitle = '';
    this.templateContent = '';
    this.selectedTemplate = null;
}
autoAssign() {
  this.apartmentService.autoAssignApartments().subscribe(
    (response: any) => {
      alert(response.message);
      this.ngOnInit(); // Refresh data after distribution
    },
    (error) => {
      console.error('Error distributing apartments:', error);
    }
  );
}
getUniqueValues(key: string): string[] {
  return [...new Set(this.apartments.map(item => item[key]).filter(value => value))];
}

populateDistrictsAndCities(): void {
  const districtsSet = new Set<string>();
  const citiesByDistrictTemp: { [district: string]: string[] } = {};

  this.apartments.forEach(apartment => {
    const locationParts = apartment.location_date.split(', ');
    const district = locationParts[0];
    const city = locationParts[1] || '';

    districtsSet.add(district);
    if (!citiesByDistrictTemp[district]) {
      citiesByDistrictTemp[district] = [];
    }
    if (city && !citiesByDistrictTemp[district].includes(city)) {
      citiesByDistrictTemp[district].push(city);
    }
  });

  this.districts = Array.from(districtsSet);
  this.citiesByDistrict = citiesByDistrictTemp;
}

onDistrictChange(): void {
  this.availableCities = this.selectedDistricts
    .flatMap(district => this.citiesByDistrict[district] || [])
    .filter((city, index, self) => self.indexOf(city) === index); // Remove duplicates
  this.selectedCities = []; // Reset city selection when districts change
  this.onFilterChange();
}


onCityChange(): void {
  this.onFilterChange();
}
// Function to check if the price string is in UAH
isHryvnia(price: string): boolean {
  return price.includes('грн');
}

// Function to convert price from UAH to USD
convertToUSD(price: string): number {
  const cleanPrice = parseFloat(price.replace(/[^\d]/g, '')) || 0; // Remove non-digit characters
  return this.isHryvnia(price) ? cleanPrice / this.UAH_TO_USD_RATE : cleanPrice; // Convert if in UAH
}
onFilterChange(): void {
  this.filteredApartments = this.apartments.filter(apartment => {
    const priceUSD = this.convertToUSD(apartment.price || '');

    const locationParts = apartment.location_date ? apartment.location_date.split(', ') : [];
    const district = locationParts[0] || '';
    const city = locationParts[1] || '';

    const matchesDistrict = this.selectedDistricts.length === 0 || this.selectedDistricts.includes(district);
    const matchesCity = this.selectedCities.length === 0 || this.selectedCities.includes(city);

    return (
      (!this.filterText || apartment.title?.toLowerCase().includes(this.filterText.toLowerCase()) ||
        apartment.description?.toLowerCase().includes(this.filterText.toLowerCase())) &&
      (!this.typeDeal || apartment.type_deal === this.typeDeal) &&
      (!this.owner || apartment.owner?.toLowerCase().includes(this.owner.toLowerCase())) &&
      (!this.rooms || apartment.room === this.rooms) &&
      (!this.filterById || apartment.id === this.filterById) &&
      (!this.priceMin || priceUSD >= this.priceMin) &&
      (!this.priceMax || priceUSD <= this.priceMax) &&
      matchesDistrict &&
      matchesCity
    );
  });
}


onStatusChange(event: Event, apartmentId: number): void {
  const newStatus = (event.target as HTMLSelectElement).value;
  this.updateAdStatus(apartmentId, newStatus);
}

updateAdStatus(apartmentId: number, newStatus: string): void {
  this.apartmentService.updateApartmentStatus(apartmentId, newStatus).subscribe(() => {
    // Update the filtered list to reflect the change immediately
    this.filteredApartments = this.filteredApartments.map(apartment => {
      if (apartment.id === apartmentId) {
        apartment.ad_status = newStatus;
      }
      return apartment;
    });
  });
}
}
