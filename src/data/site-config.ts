import ogCard from '../assets/figure/og-card.png';
import avatar from '../assets/site-images/homepage/avatar.webp';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
  website: 'https://ahamedrasel.com',
  avatar: {
    src: avatar,
    alt: 'Ahamed Rasel',
  },
  title: 'Ahamed Rasel',
  subtitle: 'Senior Technical Writer · AuthLab · WPManageNinja',
  description:
    'I make complicated software make sense. Documentation for a WordPress suite on 1.47M+ sites, plus the AI agents and n8n workflows that keep it accurate.',
  image: {
    src: ogCard,
    alt: 'Ahamed Rasel — Technical Writer & AI Automation',
  },
  headerNavLinks: [
    { text: 'Home', href: '/' },
    { text: 'Projects', href: '/projects' },
    { text: 'Blog', href: '/blog' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ],
  footerNavLinks: [
    { text: 'Tags', href: '/tags' },
    { text: 'Terms', href: '/terms' },
    { text: 'Résumé', href: '/Md-Rasel-Ahamed-Resume.pdf' },
  ],
  socialLinks: [
    { text: 'GitHub', href: 'https://github.com/ah-rasel5' },
    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/md-rasel-ahamed-8a4b72195' },
    { text: 'Email', href: 'mailto:rasel.ahm55@gmail.com' },
  ],
  hero: {
    title: 'I make complicated software make sense.',
    text: [
      'I started out writing help articles, which meant every reader arrived already frustrated. That turned out to be the whole job: nobody opens documentation on a good day, and the writing has to work anyway.',
      'Today I run the knowledge base for a WordPress plugin suite on 1.47M+ sites. Every release quietly ages something already published, and that is a race you lose by hand — so I stopped running it, and built AI agents and n8n workflows that draft, review, and audit the docs as fast as the product ships.',
      'The rest of my time goes to writing about it: docs as a product decision, prompt engineering that survives production, and the unglamorous automation that actually holds up.',
    ].join('\n\n'),
    actions: [{ text: 'Contact', href: '/contact' }],
  },
  subscribe: {
    // Flip to `true` and point `form.action` at a real endpoint (Mailchimp,
    // Formspree, ConvertKit…) to show the newsletter box.
    enabled: false,
    title: 'Subscribe to the newsletter',
    text: 'One update per week. All the latest posts directly in your inbox.',
    form: {
      action: '#',
    },
  },
  postsPerPage: 8,
  projectsPerPage: 8,
};

export default siteConfig;
