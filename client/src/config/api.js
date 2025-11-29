// API configuration for different environments
const getApiUrl = () => {
  // In production (Vercel), use relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, use proxy or localhost
  return '';
};

export const API_BASE_URL = getApiUrl();

