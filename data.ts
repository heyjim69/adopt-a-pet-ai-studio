export interface PortfolioItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  date: string;
  temp: string;
  delta: string;
  tags: string[];
  description: string;
  link?: string;
  hue: number;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'co_01',
    index: 'PORTFOLIO_CO_01',
    title: 'AURORA',
    subtitle: 'AI Creative Studio',
    date: '01.02.2024',
    temp: '33.78',
    delta: '+00.95',
    tags: ['AI', 'GENERATIVE', 'WEB'],
    description: 'A generative design studio producing on-demand brand systems via diffusion + LLM pipelines.',
    link: '#',
    hue: 210
  },
  {
    id: 'co_02',
    index: 'PORTFOLIO_CO_02',
    title: 'OVERPASS',
    subtitle: 'On-chain Identity Layer',
    date: '06.01.2023',
    temp: '24.84',
    delta: '-03.98',
    tags: ['CRYPTO', 'IDENTITY', 'PROTOCOL'],
    description: 'A reputation graph for decentralised communities — credentials without custodians.',
    link: '#',
    hue: 195
  },
  {
    id: 'co_03',
    index: 'PORTFOLIO_CO_03',
    title: 'NORTHWIND',
    subtitle: 'Consumer iOS App',
    date: '11.08.2024',
    temp: '29.12',
    delta: '+01.40',
    tags: ['MOBILE', 'CONSUMER', 'DESIGN'],
    description: 'A daily journaling companion blending ambient audio, AI memory and mindful UI.',
    link: '#',
    hue: 220
  },
  {
    id: 'co_04',
    index: 'PORTFOLIO_CO_04',
    title: 'GLACIER',
    subtitle: 'DAO Treasury Tools',
    date: '03.04.2025',
    temp: '18.05',
    delta: '-05.21',
    tags: ['DAO', 'FINANCE', 'ANALYTICS'],
    description: 'Risk-aware treasury dashboards for decentralised organisations operating across L2s.',
    link: '#',
    hue: 200
  }
];

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export const STATS: StatItem[] = [
  { label: 'YEARS BUILDING', value: '07' },
  { label: 'SHIPPED PROJECTS', value: '24' },
  { label: 'COMMUNITIES', value: '12' },
  { label: 'COFFEES / DAY', value: '∞' }
];

export interface SkillSet {
  category: string;
  items: string[];
}

export const SKILLS: SkillSet[] = [
  {
    category: '/// DESIGN',
    items: ['Brand Systems', '3D / Motion', 'Product UX', 'Spatial UI']
  },
  {
    category: '/// ENGINEERING',
    items: ['TypeScript / React', 'Three.js / WebGL', 'Solidity / EVM', 'Node / Edge Functions']
  },
  {
    category: '/// AI',
    items: ['LLM Tooling', 'RAG Pipelines', 'Agentic Flows', 'Prompt Architecture']
  },
  {
    category: '/// OPERATIONS',
    items: ['Community Building', 'Token Design', 'Fundraising', 'GTM Strategy']
  }
];
