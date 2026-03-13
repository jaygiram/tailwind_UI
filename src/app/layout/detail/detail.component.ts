import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStateService } from '../../core/portfolio-state.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {

  constructor(public state: PortfolioStateService) {}

  currentShot = 0;
  intervalId: any;

  // Toast variables (for popup messages)
  copied = false;
  copyMessage = '';

  ngOnInit() {

    // Auto change screenshot every 5 seconds
    this.intervalId = setInterval(() => {

      const project = this.state.selectedItem();

      if (project?.screenshots?.length) {
        this.currentShot =
          (this.currentShot + 1) % project.screenshots.length;
      }

    }, 5000);

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
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

  // CONTACT FORM FUNCTION
  sendMessage(form: any) {

    if (form.invalid) return;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: "67d0c720-af72-45aa-8bdd-ad341c6211ae",
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      })
    })
    .then(res => res.json())
    .then(data => {

      if (data.success) {

        // show toast
        this.copyMessage = "Message sent successfully";
        this.copied = true;

        // reset form
        form.reset();

        setTimeout(() => {
          this.copied = false;
        }, 2000);

      }

    })
    .catch(error => {
      console.error("Message failed", error);
    });

  }

}