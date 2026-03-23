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
  sections = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'profile', label: 'Profile', icon: 'fa-user' },
    { id: 'projects', label: 'Projects', icon: 'fa-diagram-project' },
    { id: 'blogs', label: 'Blogs', icon: 'fa-pen' },
    { id: 'contact', label: 'Contact', icon: 'fa-envelope' }
  ];

  constructor(public state: PortfolioStateService) {}

  select(section: string) {
    this.state.setSection(section);
  }

}
