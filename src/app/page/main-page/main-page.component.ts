import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import { ApartmentService } from '../../apartment.service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
interface ApartmentFile {
  id: number;
  filename: string;
  date: string;
  content_type: string;
  file_path: string;
  order: number;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class MainPageComponent implements OnInit {
  templates: any[] = [];
  templateTitle = '';
  templateContent = '';
  selectedTemplate: any = null;
  selectedTemplateName: string = '';
  typeObject: string = '';
  apartments: any[] = [];
  filteredApartments: any[] = [];
  selectedStatus: string = 'All';
  statusOptions: string[] = ['new', 'activation_soon', 'inactive', 'successful', 'spam'];
  districts: string[] = [];
  citiesByDistrict: { [district: string]: string[] } = {};
  selectedDistricts: string[] = [];
  selectedCities: string[] = [];
  availableCities: string[] = []; // Available cities based on selected district(s)

  // Filter parameters
  filterText: string = '';
  typeDeal: string = '';

  priceMin: number | null = null;
  priceMax: number | null = null;
  owner: string = '';
  rooms: string = '';
  readonly UAH_TO_USD_RATE = 41.5; // Fixed exchange rate
  // Filter options for dropdowns
  typeDealOptions: string[] = [];
  typeObjectOptions: string[] = [];
  ownerOptions: string[] = [];
  selectedFile: File | null = null;
  filterById: number | null = null; // New filter for ID
  trapWords: string[] = [];
  stopWords: string[] = [];
  verificationApartments: any[] = [];

  newTrapWord: string = '';
  newStopWord: string = '';
  constructor(private apartmentService: ApartmentService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTrapWords();
    this.fetchStopWords();
    this.fetchVerificationApartments();
    this.apartmentService.getApartments().subscribe((data: any[]) => {
      this.apartments = data.map(apartment => ({
        ...apartment,
        expanded: false, // Default collapsed state
      }));
      this.filteredApartments = data;
      this.fetchTemplates();

      // Populate unique values for filter dropdowns
      this.typeDealOptions = this.getUniqueValues('type_deal');
      this.typeObjectOptions = this.getUniqueValues('type_object');
      this.ownerOptions = this.getUniqueValues('owner');

      // Populate unique districts and cities
      this.populateDistrictsAndCities();
    });
  }


  // ✅ Start Parser
  startParser(): void {
    this.http.get('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/start_scraping/', {}).subscribe(() => {
      alert('Parser started');
    });
  }

  // ✅ Stop Parser
  stopParser(): void {
    this.http.get('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/stop_scraping/', {}).subscribe(() => {
      alert('Parser stopped');
    });
  }

  // ✅ Start Auto Posting
  startAutoPosting(): void {
    this.http.get('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/start_autoposting/', {}).subscribe(() => {
      alert('Auto posting started');
    });
  }

  // ✅ Stop Auto Posting
  stopAutoPosting(): void {
    this.http.get('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/stop_autoposting/', {}).subscribe(() => {
      alert('Auto posting stopped');
    });
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

  applyWatermark(imageId: number, apartmentId: number): void {
    this.http.put(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/apartments/${apartmentId}/apply_watermark/${imageId}`, {}, {
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
  this.http.put(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/apartments/${apartmentId}/remove_watermark_ai/${imageId}`, {}, {

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
      const priceUSD = this.convertToUSD(apartment.price);

      const locationParts = apartment.location_date.split(', ');
      const district = locationParts[0];
      const city = locationParts[1] || '';

      const matchesDistrict = this.selectedDistricts.length === 0 || this.selectedDistricts.includes(district);
      const matchesCity = this.selectedCities.length === 0 || this.selectedCities.includes(city);

      return (
        (this.filterText === '' || apartment.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
          apartment.description.toLowerCase().includes(this.filterText.toLowerCase())) &&
        (this.typeDeal === '' || apartment.type_deal === this.typeDeal) &&
        (this.typeObject === '' || apartment.type_object === this.typeObject) &&
        (this.owner === '' || apartment.owner.toLowerCase().includes(this.owner.toLowerCase())) &&
        (this.rooms === '' || apartment.room === this.rooms) &&
        (this.filterById === null || apartment.id === this.filterById) &&
        (this.priceMin === null || priceUSD >= this.priceMin) &&
        (this.priceMax === null || priceUSD <= this.priceMax) &&
        matchesDistrict &&
        matchesCity
      );
    });
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
  
      this.http.post(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/apartments/${apartmentId}/upload_images`, formData)
        .subscribe(() => {
          this.getAllAds();  // Refresh list after upload
        });
    }
  }
  
  deleteImage(imageId: number): void {
    this.http.delete(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/images/${imageId}`)
      .subscribe(() => {
        this.getAllAds();  // Refresh list after deletion
      });
  }
  
  reorderImages(event: CdkDragDrop<ApartmentFile[]>, apartmentId: number): void {
    const apartment = this.apartments.find(ap => ap.id === apartmentId);
    if (!apartment || !apartment.files) {
      console.warn('Apartment or files not found.');
      return;
    }
  
    // Log the indices
    console.log('Previous Index:', event.previousIndex);
    console.log('Current Index:', event.currentIndex);
  
    // Reorder the files array locally
    moveItemInArray(apartment.files, event.previousIndex, event.currentIndex);
  
    // Log the new order of files by IDs
    console.log(
      'New file order (IDs):',
      apartment.files.map((file: ApartmentFile) => file.id) // Explicitly typing `file` as ApartmentFile
    );
  
    // Map the files to create the payload for backend
    const orderUpdates = apartment.files.map((file: ApartmentFile, index: number) => ({
      image_id: file.id,
      new_order: index,
    }));
  
    // Log the order updates payload
    console.log('Order Updates Payload:', orderUpdates);
  
    // Send updates to the backend
    this.http.put(
      `https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/apartments/${apartmentId}/reorder_images`,
      orderUpdates
    ).subscribe(
      () => {
        console.log('Image order updated successfully');
        // Optionally refresh the data
        // this.getAllAds();
      },
      error => {
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
  // Fetch Trap Words (Blacklist)
  fetchTrapWords(): void {
    this.http.get<string[]>('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/get_traps').subscribe(
      data => this.trapWords = data,
      error => console.error('Error fetching trap words:', error)
    );
  }

  // Fetch Stop Words
  fetchStopWords(): void {
    this.http.get<string[]>('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/get_stop_words').subscribe(
      data => this.stopWords = data,
      error => console.error('Error fetching stop words:', error)
    );
  }

  // Fetch Apartments Needing Verification
  fetchVerificationApartments(): void {
    this.http.get<any[]>('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/verification_ads').subscribe(
      data => this.verificationApartments = data,
      error => console.error('Error fetching verification ads:', error)
    );
  }

  // Add Trap Word (Blacklist)
  addTrapWord(): void {
    this.http.post('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/add_trap/', { word: this.newTrapWord }).subscribe(() => {
      this.fetchTrapWords();
      this.newTrapWord = '';
    });
  }

  // Remove Trap Word
  removeTrapWord(word: string): void {
    this.http.delete(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/remove_trap/${word}`).subscribe(() => {
      this.fetchTrapWords();
    });
  }

  // Add Stop Word
  addStopWord(): void {
    this.http.post('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/add_stop_word/', { word: this.newStopWord }).subscribe(() => {
      this.fetchStopWords();
      this.newStopWord = '';
    });
  }

  // Remove Stop Word
  removeStopWord(word: string): void {
    this.http.delete(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/remove_stop_word/${word}`).subscribe(() => {
      this.fetchStopWords();
    });
  }

  // Approve Apartment for Posting
  approveApartment(apartmentId: number): void {
    this.http.put(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/verify_ad/${apartmentId}`, { decision: "relevant" }).subscribe(() => {
      this.fetchVerificationApartments();
    });
  }

  // Reject Apartment (Move to Spam)
  rejectApartment(apartmentId: number): void {
    this.http.put(`https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/verify_ad/${apartmentId}`, { decision: "spam" }).subscribe(() => {
      this.fetchVerificationApartments();
    });
  }

  // Run Parser
  runParser(): void {
    this.http.post('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/run_parser/', {}).subscribe(() => {
      alert('Parser started successfully!');
    });
  }

  // Run Auto Posting
  runAutoPosting(): void {
    this.http.post('https://lviv-pject-git-main-rentsearchrs-projects.vercel.app/admin/start_auto_posting/', {}).subscribe(() => {
      alert('Auto Posting started successfully!');
    });
  }
}
