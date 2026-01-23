const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

// Generic fetch function
async function fetchAPI<T>(endpoint: string): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from Strapi: ${endpoint}`, error);
    throw error;
  }
}

// Page types
export interface PageAttributes {
  title: string;
  slug: string;
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  template?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Article types
export interface ArticleAttributes {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author?: string;
  category?: {
    data: StrapiEntity<{ name: string; slug: string }>;
  };
  status: 'draft' | 'pending' | 'published';
  createdAt: string;
  updatedAt: string;
}

// Case/Example types
export interface CaseAttributes {
  title: string;
  slug: string;
  organization: string;
  description: string;
  tools: string;
  outcomes: string;
  submittedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Sandbox Project types
export interface SandboxProjectAttributes {
  title: string;
  slug: string;
  status: 'planning' | 'active' | 'completed';
  description: string;
  progress: string;
  partners: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// FAQ types
export interface FAQAttributes {
  question: string;
  answer: string;
  category?: string;
  order: number;
}

// Guidance Link types
export interface GuidanceLinkAttributes {
  title: string;
  url: string;
  category: string;
  description: string;
}

// API functions
export async function getPages() {
  return fetchAPI<StrapiEntity<PageAttributes>[]>('/pages?populate=*');
}

export async function getPage(slug: string) {
  const response = await fetchAPI<StrapiEntity<PageAttributes>[]>(
    `/pages?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

export async function getArticles(limit?: number) {
  const query = limit
    ? `/articles?populate=*&sort=publishedAt:desc&pagination[limit]=${limit}`
    : '/articles?populate=*&sort=publishedAt:desc';
  return fetchAPI<StrapiEntity<ArticleAttributes>[]>(query);
}

export async function getArticle(slug: string) {
  const response = await fetchAPI<StrapiEntity<ArticleAttributes>[]>(
    `/articles?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

export async function getCases() {
  return fetchAPI<StrapiEntity<CaseAttributes>[]>(
    '/cases?populate=*&filters[status][$eq]=approved&sort=createdAt:desc'
  );
}

export async function getCase(slug: string) {
  const response = await fetchAPI<StrapiEntity<CaseAttributes>[]>(
    `/cases?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

export async function getSandboxProjects() {
  return fetchAPI<StrapiEntity<SandboxProjectAttributes>[]>(
    '/sandbox-projects?populate=*&sort=createdAt:desc'
  );
}

export async function getSandboxProject(slug: string) {
  const response = await fetchAPI<StrapiEntity<SandboxProjectAttributes>[]>(
    `/sandbox-projects?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

export async function getFAQs() {
  return fetchAPI<StrapiEntity<FAQAttributes>[]>('/faqs?sort=order:asc');
}

export async function getGuidanceLinks() {
  return fetchAPI<StrapiEntity<GuidanceLinkAttributes>[]>('/guidance-links?populate=*');
}
