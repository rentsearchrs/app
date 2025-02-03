import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class NavbarComponent  {
  isMobileMenuOpen = false;
  dropdownStates: { [key: string]: boolean } = {
    sale: false,
    rent: false,
    mobileSale: false,
    mobileRent: false,
  };

  saleMenuItems = [
    { name: 'Квартир', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-kvartyr' },
    { name: 'Кімнат', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-kimnat' },
    { name: 'Будинків', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-budynkiv' },
    { name: 'Землі', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-zemli' },
    { name: 'Комерційної нерухомості', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-komertsiynoi-nerukhomosti' },
    { name: 'Гаражів/парковок', link: 'https://xhouse.xcorp.com.ua/objects/rubric_prodazh-harazhiv-parkovok' },
  ];

  rentMenuItems = [
    { name: 'Квартир', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-kvartyr' },
    { name: 'Кімнат', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-kimnat' },
    { name: 'Будинків', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-budynkiv' },
    { name: 'Землі', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-zemli' },
    { name: 'Комерційної нерухомості', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-komertsiynoi-nerukhomosti' },
    { name: 'Гаражів/парковок', link: 'https://xhouse.xcorp.com.ua/objects/rubric_orenda-harazhiv-parkovok' },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(event: Event, menu: string): void {
    event.preventDefault();
    this.dropdownStates[menu] = !this.dropdownStates[menu];
  }
}