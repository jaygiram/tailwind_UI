import { Component } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { ContentComponent } from "../content/content.component";
import { DetailComponent } from "../detail/detail.component";
import { ContactBarComponent } from "../contact-bar/contact-bar.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavigationComponent, ContentComponent, DetailComponent, ContactBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
