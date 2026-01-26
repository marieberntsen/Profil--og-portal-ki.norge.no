import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  // Clear the preview cookie
  cookies.delete('preview', { path: '/' });

  // Redirect back to the referring page or home
  const referer = url.searchParams.get('redirect') || '/';
  return redirect(referer, 307);
};
