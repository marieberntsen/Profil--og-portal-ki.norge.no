import type { APIRoute } from 'astro';

const PREVIEW_SECRET = import.meta.env.PREVIEW_SECRET || 'preview-secret-change-me';

// Map content types to their frontend paths
const contentTypeRoutes: Record<string, (slug: string) => string> = {
  artikkel: (slug) => `/artikler/${slug}`,
  side: (slug) => `/${slug}`,
  eksempel: (slug) => `/eksempler/${slug}`,
  veiledning: (slug) => `/veiledning/${slug}`,
  faq: () => '/faq',
};

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret');
  const type = url.searchParams.get('type');
  const documentId = url.searchParams.get('documentId');
  const status = url.searchParams.get('status') || 'draft';

  // Validate secret
  if (secret !== PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  if (!type || !documentId) {
    return new Response('Missing type or documentId', { status: 400 });
  }

  // Set preview cookie (expires in 1 hour)
  cookies.set('preview', JSON.stringify({ enabled: true, documentId, status }), {
    path: '/',
    maxAge: 60 * 60, // 1 hour
    httpOnly: true,
    sameSite: 'lax',
  });

  // Fetch the content to get the slug for redirect
  const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';

  try {
    // Fetch the document to get its slug
    const contentTypeMap: Record<string, string> = {
      artikkel: 'artikkels',
      side: 'sides',
      eksempel: 'eksempels',
      veiledning: 'veilednings',
      faq: 'faqs',
    };

    const apiEndpoint = contentTypeMap[type];
    if (!apiEndpoint) {
      return new Response(`Unknown content type: ${type}`, { status: 400 });
    }

    // Use status=draft to get draft content
    const response = await fetch(
      `${strapiUrl}/api/${apiEndpoint}?filters[documentId][$eq]=${documentId}&status=${status}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Strapi fetch failed:', response.status, await response.text());
      return new Response('Failed to fetch content from Strapi', { status: 500 });
    }

    const data = await response.json();
    const content = data.data?.[0];

    if (!content) {
      return new Response('Content not found', { status: 404 });
    }

    // Get the slug and build redirect URL
    const slug = content.slug || content.documentId;
    const routeBuilder = contentTypeRoutes[type];

    if (!routeBuilder) {
      return new Response(`No route configured for type: ${type}`, { status: 400 });
    }

    const targetPath = routeBuilder(slug);

    // Redirect to the preview page with preview query param
    return redirect(`${targetPath}?preview=true`, 307);
  } catch (error) {
    console.error('Preview error:', error);
    return new Response('Preview error', { status: 500 });
  }
};

// Also handle POST for when Strapi sends a POST request
export const POST: APIRoute = async (context) => {
  return GET(context);
};
