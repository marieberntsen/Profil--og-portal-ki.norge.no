export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('FRONTEND_URL', 'http://localhost:4321')],
      async handler(uid, { documentId, locale, status }) {
        // Map Strapi content types to frontend paths
        const frontendUrl = env('FRONTEND_URL', 'http://localhost:4321');
        const secret = env('PREVIEW_SECRET', 'preview-secret-change-me');

        // Extract the content type name from uid (e.g., 'api::artikkel.artikkel' -> 'artikkel')
        const contentType = uid.split('.').pop();

        // Build preview URL with query params
        const params = new URLSearchParams({
          secret,
          type: contentType,
          documentId,
          status: status || 'draft',
        });

        if (locale) {
          params.set('locale', locale);
        }

        return `${frontendUrl}/api/preview?${params.toString()}`;
      },
    },
  },
});
