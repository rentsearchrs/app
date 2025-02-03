import { AfterViewInit, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class ItemSearchComponent implements OnInit, AfterViewInit{
  showPriceSection: boolean = false;
  showRoomsSection: boolean = false;
  showFeaturesSection: boolean = false;
  showSpaceSection: boolean = false;


  apartments: any[] = [];
  filteredApartments: any[] = [];
  paginatedApartments: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;

  // Filter parameters
  rubrics: string[] = [];
  selectedRubrics: string[] = [];

  locations: string[] = [];
  selectedLocations: string[] = [];

  keywordOptions: string[] = [];
  filterKeywords: string[] = [];

  currencyOptions = ['UAH', 'USD'];
  selectedCurrency: string = 'UAH';

  roomOptions = ['1', '2', '3', '4', '5+'];
  selectedRooms: string[] = [];

  priceMin: number | null = null;
  priceMax: number | null = null;

  // Additional dynamic data
  features: string[] = ['Fitted Kitchen', 'Balcony/Terrace', 'Basement', 'Parking Space', 'Guest WC'];
  selectedFeatures: { [key: string]: boolean } = {};
  propertyTypes: string[] = ['Flat', 'Loft', 'Maisonette', 'Ground Floor'];
  selectedPropertyType: string | null = null;
  marketingTypes: string[] = ['Rent', 'Buy', 'Build'];
  selectedMarketingType: string = 'Rent';

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchData();
    this.loadExternalScripts();
  }

  ngAfterViewInit(): void {
    // Initialize jQuery functionality after the scripts have loaded
    setTimeout(() => {
      this.initializeJQueryCode();
    }, 1000); // Slight delay to ensure scripts are loaded
  }

  fetchData(): void {
    const apiUrl = 'http://127.0.0.1:8000/get_orders_and_photo/';

    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        console.log('Fetched Data:', data);
        this.apartments = data || [];
        this.filteredApartments = [...this.apartments];
        console.log('Initial Filtered Apartments:', this.filteredApartments);

        this.rubrics = this.getUniqueValues('type_object');
        console.log('Unique Rubrics:', this.rubrics);

        this.locations = this.getUniqueValues('location_date');
        console.log('Unique Locations:', this.locations);

        this.keywordOptions = this.getKeywords();
        console.log('Keywords:', this.keywordOptions);

        this.onFilterChange();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getUniqueValues(key: string): string[] {
    return [
      ...new Set(
        this.apartments
          .map((item) => item[key])
          .filter((value) => value !== undefined && value !== null)
      ),
    ];
  }

  getKeywords(): string[] {
    return [
      ...new Set(
        this.apartments.flatMap((apartment) =>
          apartment.title
            ? apartment.title.split(' ').map((word: string) => word.toLowerCase())
            : []
        )
      ),
    ];
  }

  convertToUSD(price: string | null): number {
    if (!price) return 0;
    const cleanPrice = parseFloat(price.replace(/[^\d]/g, '')) || 0;
    return this.isHryvnia(price) ? cleanPrice / 41.5 : cleanPrice;
  }

  isHryvnia(price: string): boolean {
    return price.includes('грн');
  }

  onFilterChange(): void {
    console.log('Filter Change Triggered');
    console.log('Selected Rubrics:', this.selectedRubrics);
    console.log('Selected Locations:', this.selectedLocations);
    console.log('Filter Keywords:', this.filterKeywords);
    console.log('Price Min:', this.priceMin, 'Price Max:', this.priceMax);
    console.log('Selected Currency:', this.selectedCurrency);
    console.log('Selected Rooms:', this.selectedRooms);
    console.log('Selected Features:', this.selectedFeatures);
    console.log('Selected Property Type:', this.selectedPropertyType);
    console.log('Selected Marketing Type:', this.selectedMarketingType);

    this.filteredApartments = this.apartments.filter((apartment) => {
      const priceUSD = this.convertToUSD(apartment.price || '');
      const rubricMatch =
        this.selectedRubrics.length === 0 || this.selectedRubrics.includes(apartment.type_object);
      const locationMatch =
        this.selectedLocations.length === 0 || this.selectedLocations.includes(apartment.location_date);
      const keywordMatch =
        this.filterKeywords.length === 0 ||
        this.filterKeywords.some((keyword) =>
          apartment.title?.toLowerCase().includes(keyword.toLowerCase())
        );
      const priceMatch =
        (this.priceMin === null || priceUSD >= this.priceMin) &&
        (this.priceMax === null || priceUSD <= this.priceMax);
      const currencyMatch =
        this.selectedCurrency === '' ||
        this.selectedCurrency === apartment.currency ||
        !apartment.currency;
      const roomMatch =
        this.selectedRooms.length === 0 ||
        this.selectedRooms.includes(apartment.room?.toString());
      const featureMatch = Object.keys(this.selectedFeatures).every(
        (feature) => !this.selectedFeatures[feature] || apartment.features?.includes(feature)
      );
      const propertyTypeMatch =
        !this.selectedPropertyType || this.selectedPropertyType === apartment.property_type;
      const marketingTypeMatch =
        this.selectedMarketingType === apartment.marketing_type || !apartment.marketing_type;

      const result =
        rubricMatch &&
        locationMatch &&
        keywordMatch &&
        priceMatch &&
        currencyMatch &&
        roomMatch &&
        featureMatch &&
        propertyTypeMatch &&
        marketingTypeMatch;

      console.log('Apartment:', apartment, 'Included:', result);
      return result;
    });

    console.log('Filtered Apartments:', this.filteredApartments);
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedApartments = this.filteredApartments.slice(startIndex, endIndex);
    console.log('Paginated Apartments:', this.paginatedApartments);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePagination();
  }

  totalPages(): number {
    return Math.ceil(this.filteredApartments.length / this.itemsPerPage);
  }
  private loadExternalScripts(): void {
    // List of script URLs
    const scripts = [
      'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js',
      'https://use.fontawesome.com/62059e4801.js',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',
    ];

    scripts.forEach((src) => {
      const script = this.renderer.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;
      this.renderer.appendChild(document.body, script);
    });
  }

  private initializeJQueryCode(): void {
    // Ensure jQuery is available globally
    if (typeof $ !== 'undefined') {
      $('#btn-price').on('click', function () {
        $('#container-price').append($('#input-price'));
      });

      $('#btn-rooms').on('click', function () {
        $('#container-rooms').append($('#input-rooms'));
      });

      $('#btn-features').on('click', function () {
        $('#container-features').append($('#input-features'));
      });

      $('#btn-space').on('click', function () {
        $('#container-space').append($('#input-space'));
      });
    } else {
      console.error('jQuery is not loaded. Please check the script URLs.');
    }
  }
}