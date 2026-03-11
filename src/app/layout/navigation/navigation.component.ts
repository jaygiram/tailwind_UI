import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/portfolio-state.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {

  constructor(public state: PortfolioStateService) {}

  select(section: string) {
    this.state.setSection(section);
  }

}