import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/portfolio-state.service';
import { PROJECTS } from '../../core/projects.data';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {

  projects = PROJECTS;
  searchText = "";
  constructor(public state: PortfolioStateService) {}

  openProject(project: any) {
 
    this.state.setItem(project);
  
  }

  selectedFilter = 'All';

  setFilter(filter: string){
    this.selectedFilter = filter;
  }
  
  get filteredProjects(){

    let filtered = this.projects;
  
    if(this.searchText){
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        project.tech.some(t =>
          t.toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }
  
    if(this.selectedFilter !== "All"){
      filtered = filtered.filter(project =>
        project.tech.includes(this.selectedFilter)
      );
    }
  
    return filtered;
  
  }

  roles = [
    "UI/UX Lead",
    "Mendix Developer",
    "Frontend Engineer"
  ];
  
  currentRole = "";
  roleIndex = 0;
  charIndex = 0;

  skills = [
    { name: "Mendix", level: 95, width: 0 },
    { name: "Figma", level: 85, width: 0 },
    { name: "HTML", level: 80, width: 0 },
    { name: "CSS", level: 80, width: 0 },
    { name: "UI/UX", level: 90, width: 0 },
    { name: "Canva", level: 70, width: 0 }
  ];

  ngOnInit() {

    // Start typewriter
    this.typeEffect();

    // Animate skill bars
    setTimeout(() => {
      this.skills.forEach(skill => {
        skill.width = skill.level;
      });
    }, 300);

  }

  typeEffect() {

    const currentText = this.roles[this.roleIndex];

    if (this.charIndex < currentText.length) {

      this.currentRole += currentText.charAt(this.charIndex);
      this.charIndex++;

      setTimeout(() => this.typeEffect(), 70);

    } else {

      setTimeout(() => {

        this.currentRole = "";
        this.charIndex = 0;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;

        this.typeEffect();

      }, 1500);

    }

  }
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }
}