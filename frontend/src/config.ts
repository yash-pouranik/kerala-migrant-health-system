// Use relative URLs in production (Vercel) to call serverless functions on same domain
// Use localhost in development
const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction
    ? '' // Empty string means relative URLs (same domain)
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const getApiUrl = (endpoint: string) => {
    // Remove leading slash if present to avoid double slashes
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return isProduction ? `/${path}` : `${API_BASE_URL}/${path}`;
};
