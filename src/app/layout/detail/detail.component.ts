import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/portfolio-state.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {

  constructor(public state: PortfolioStateService) {}

  currentShot = 0;

  ngOnInit() {

    // Auto change screenshot every 5 seconds
    setInterval(() => {

      const project = this.state.selectedItem();

      if (project?.screenshots?.length) {
        this.currentShot =
          (this.currentShot + 1) % project.screenshots.length;
      }

    }, 5000);

  }

  nextShot(project: any) {

    if (!project?.screenshots?.length) return;

    this.currentShot =
      (this.currentShot + 1) % project.screenshots.length;

  }
  
  prevShot(project: any) {

    if (!project?.screenshots?.length) return;

    this.currentShot =
      (this.currentShot - 1 + project.screenshots.length)
      % project.screenshots.length;

  }

}