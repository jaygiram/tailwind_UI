import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {

  selectedSection = signal<string>('home');

  selectedItem = signal<any>(null);

  setSection(section: string) {
    this.selectedSection.set(section);
    this.selectedItem.set(null);
  }

  setItem(item: any) {
    this.selectedItem.set(item);
  }

}