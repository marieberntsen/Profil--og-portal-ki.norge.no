const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

// Strapi v5 response format
interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: object;
}

// Strapi v5 blocks field types
export interface BlockNode {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'image' | 'link';
  children?: BlockChild[];
  level?: number;
  format?: 'ordered' | 'unordered';
  url?: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
}

export interface BlockChild {
  type: 'text' | 'link';
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  children?: BlockChild[];
}

// Content types matching Strapi schemas
export interface Artikkel {
  id: number;
  documentId: string;
  tittel: string;
  slug: string;
  innhold?: BlockNode[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Side {
  id: number;
  documentId: string;
  tittel: string;
  slug: string;
  innhold?: BlockNode[];
  template?: 'standard' | 'bred' | 'landingsside';
  seoTittel?: string;
  seoBeskrivelse?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Eksempel {
  id: number;
  documentId: string;
  tittel: string;
  slug: string;
  organisasjon?: string;
  beskrivelse?: BlockNode[];
  verktoy?: string[];
  resultater?: string;
  status?: 'i_utvikling' | 'pilot' | 'i_drift' | 'avsluttet';
  bilde?: StrapiMedia;
  merkelapper?: Merkelapp[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Veiledning {
  id: number;
  documentId: string;
  tittel: string;
  slug: string;
  innhold?: BlockNode[];
  kategori?: Merkelapp;
  lenker?: { tekst: string; url: string; ekstern?: boolean }[];
  rekkefølge?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface FAQ {
  id: number;
  documentId: string;
  sporsmal: string;
  svar?: BlockNode[];
  kategori?: Merkelapp;
  rekkefølge?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Merkelapp {
  id: number;
  documentId: string;
  navn: string;
  slug: string;
  beskrivelse?: string;
  locale: string;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Generic fetch function for Strapi v5
async function fetchAPI<T>(endpoint: string): Promise<StrapiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  const url = `${STRAPI_URL}/api${endpoint}`;

  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from Strapi: ${endpoint}`, error);
    throw error;
  }
}

// Helper to get full media URL
export function getMediaUrl(media?: StrapiMedia): string | undefined {
  if (!media?.url) return undefined;
  if (media.url.startsWith('http')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

// Artikkel API functions
export async function getArtikler(limit?: number) {
  const pagination = limit ? `&pagination[limit]=${limit}` : '';
  return fetchAPI<Artikkel>(`/artikkels?populate=*&sort=publishedAt:desc${pagination}`);
}

export async function getArtikkel(slug: string) {
  const response = await fetchAPI<Artikkel>(
    `/artikkels?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// Side (Page) API functions
export async function getSider() {
  return fetchAPI<Side>('/sides?populate=*');
}

export async function getSide(slug: string) {
  const response = await fetchAPI<Side>(
    `/sides?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// Eksempel (Case) API functions
export async function getEksempler() {
  return fetchAPI<Eksempel>('/eksempels?populate=*&sort=createdAt:desc');
}

export async function getEksempel(slug: string) {
  const response = await fetchAPI<Eksempel>(
    `/eksempels?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// Veiledning (Guidance) API functions
export async function getVeiledninger() {
  return fetchAPI<Veiledning>('/veilednings?populate=*&sort=rekkefølge:asc');
}

export async function getVeiledning(slug: string) {
  const response = await fetchAPI<Veiledning>(
    `/veilednings?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// FAQ API functions
export async function getFAQs() {
  return fetchAPI<FAQ>('/faqs?populate=*&sort=rekkefølge:asc');
}

export async function getFAQsByKategori(kategoriSlug: string) {
  return fetchAPI<FAQ>(
    `/faqs?filters[kategori][slug][$eq]=${kategoriSlug}&populate=*&sort=rekkefølge:asc`
  );
}

// Merkelapp (Tag) API functions
export async function getMerkelapper() {
  return fetchAPI<Merkelapp>('/merkelapps?populate=*');
}

export async function getMerkelapp(slug: string) {
  const response = await fetchAPI<Merkelapp>(
    `/merkelapps?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// Legacy compatibility - map old names to new ones
export const getArticles = getArtikler;
export const getArticle = getArtikkel;
export const getPages = getSider;
export const getPage = getSide;
export const getCases = getEksempler;
export const getCase = getEksempel;
