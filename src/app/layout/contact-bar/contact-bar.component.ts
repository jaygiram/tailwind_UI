import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/portfolio-state.service';

@Component({
  selector: 'app-contact-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-bar.component.html'
})
export class ContactBarComponent {

  constructor(public state: PortfolioStateService) {}

}