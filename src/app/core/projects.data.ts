import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Restaurant Admin Suite',
    description: 'Operations dashboard for menus, orders, staff, and analytics.',
    tech: ['Angular', 'REST API', 'Tailwind'],
    details: 'A data-heavy admin experience focused on speed, clear information hierarchy, and day-to-day restaurant operations.',
    image: 'assets/projects/restaurant-admin.png',
    screenshots: ['assets/projects/restaurant-admin.png'],
    role: 'Led the interface structure and component design for a dense internal workflow.',
    outcome: 'Reduced friction for common admin tasks by grouping actions around real operator flows.'
  },
  {
    id: 2,
    title: 'Mendix 3D Widget',
    description: 'Reusable widget that embeds interactive 3D scenes inside Mendix apps.',
    tech: ['Mendix', 'TypeScript'],
    details: 'A custom Mendix widget built to help teams bring richer product and training visuals into low-code applications without breaking platform conventions.',
    image: 'assets/projects/mendix-widget.png',
    screenshots: ['assets/projects/mendix-widget.png'],
    role: 'Designed the widget UX and implementation strategy around platform constraints.',
    outcome: 'Made advanced visuals easier to ship in enterprise Mendix environments.'
  },
  {
    id: 3,
    title: 'Glass Dashboard Concept',
    description: 'Visual system exploration for a modern analytics dashboard.',
    tech: ['Angular', 'Tailwind'],
    details: 'A concept project exploring glassmorphism, card hierarchy, and interaction patterns for a portfolio-ready UI case study.',
    image: 'assets/projects/ui-dashboard.png',
    screenshots: ['assets/projects/ui-dashboard.png'],
    role: 'Explored layout rhythm, visual hierarchy, and reusable component styling.',
    outcome: 'Created a stronger visual language that can extend into future product work.'
  }
];
