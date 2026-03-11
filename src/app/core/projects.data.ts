import { Project } from '../models/project.model';
export const PROJECTS = [

  {
    id: 1,
    title: "Restaurant Admin App",
    description: "Angular dashboard for restaurant management.",
    tech: ["Angular", "REST API"],
    details: "Admin system to manage restaurants with CRUD operations.",
    image: "assets/projects/restaurant-admin.png",
 
    screenshots: [
      "assets/projects/admin1.png",
      "assets/projects/admin2.png",
      "assets/projects/admin3.png"
    ],
  
    demo: "https://demo-link.com",
    github: "https://github.com/jay-project"
  },

  {
    id: 2,
    title: "Mendix Spline Widget",
    description: "Custom widget to embed 3D models.",
    tech: ["Mendix", "TypeScript"],
    details: "Allows Mendix applications to render Spline scenes.",
    image: "assets/projects/mendix-widget.png",

    screenshots: [
      "assets/projects/admin1.png",
      "assets/projects/admin2.png",
      "assets/projects/admin3.png"
    ],
  
    demo: "https://demo-link.com",
    github: "https://github.com/jay-project"
  },

  {
    id: 3,
    title: "UI Dashboard Concept",
    description: "Modern UI dashboard system.",
    tech: ["Angular", "Tailwind"],
    details: "Experimental UI system with glass interface.",
    image: "assets/projects/ui-dashboard.png",

    screenshots: [
      "assets/projects/admin1.png",
      "assets/projects/admin2.png",
      "assets/projects/admin3.png"
    ],
  
    demo: "https://demo-link.com",
    github: "https://github.com/jay-project"
  }

]