import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStateService } from '../../core/portfolio-state.service';
import { HeroLanyardComponent } from '../hero-lanyard/hero-lanyard.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroLanyardComponent],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
  currentShot = 0;
  intervalId: any;
  copied = false;
  copyMessage = '';

  constructor(public state: PortfolioStateService) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      const project = this.state.selectedItem();

      if (project?.screenshots?.length) {
        this.currentShot = (this.currentShot + 1) % project.screenshots.length;
      }
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  nextShot(project: any) {
    if (!project?.screenshots?.length) return;

    this.currentShot = (this.currentShot + 1) % project.screenshots.length;
  }

  prevShot(project: any) {
    if (!project?.screenshots?.length) return;

    this.currentShot = (this.currentShot - 1 + project.screenshots.length) % project.screenshots.length;
  }

  sendMessage(form: any) {
    if (form.invalid) return;

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.value.name}`);
    const body = encodeURIComponent(
      `Name: ${form.value.name}\nEmail: ${form.value.email}\n\n${form.value.message}`
    );

    this.copyMessage = 'Email draft ready';
    this.copied = true;

    window.location.href = `mailto:jaysudhirgiram@email.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      this.copied = false;
    }, 2200);
  }
}
