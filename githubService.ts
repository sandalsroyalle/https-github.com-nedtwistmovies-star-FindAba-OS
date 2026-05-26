
import { Octokit } from "octokit";

let _octokitInstance: Octokit | null = null;

export const getOctokit = (): Octokit | null => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (!token || token === '' || token.includes('YOUR_')) {
    _octokitInstance = null;
    return null;
  }

  // Sanitize token: Remove surrounding quotes, whitespace, and potential 'Bearer ' prefix
  let cleanToken = token.trim();
  
  // Remove potential quotes that might have been copied with the token
  cleanToken = cleanToken.replace(/^["']|["']$/g, '');
  
  // Remove 'Bearer ' prefix if present
  if (cleanToken.toLowerCase().startsWith('bearer ')) {
    cleanToken = cleanToken.substring(7).trim();
  }
  
  // Final safeguard: remove any non-printable characters or whitespace that might be hidden
  // eslint-disable-next-line no-control-regex
  cleanToken = cleanToken.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();

  try {
    _octokitInstance = new Octokit({ 
      auth: cleanToken,
      request: {
        timeout: 10000 // 10s timeout
      }
    });
    return _octokitInstance;
  } catch (err) {
    console.error("Github Initialization Error:", err);
    _octokitInstance = null;
    return null;
  }
};

export const checkGithubConnection = async (): Promise<{ connected: boolean; username?: string; error?: 'NO_TOKEN' | 'BAD_CREDENTIALS' | 'NETWORK_ERROR' | 'RATE_LIMITED' | 'UNKNOWN' }> => {
  const octokit = getOctokit();
  if (!octokit) return { connected: false, error: 'NO_TOKEN' };

  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    return { connected: !!data.login, username: data.login };
  } catch (err: any) {
    console.error("Github Connection Check Failed:", err);
    
    // Octokit error status codes
    if (err.status === 401 || err.status === 403 && err.message?.includes('credentials')) {
      return { connected: false, error: 'BAD_CREDENTIALS' };
    }
    if (err.status === 403 && err.message?.includes('rate limit')) {
      return { connected: false, error: 'RATE_LIMITED' };
    }
    if (err.status === 0 || err.code === 'ENOTFOUND' || err.message?.includes('fetch')) {
      return { connected: false, error: 'NETWORK_ERROR' };
    }
    return { connected: false, error: 'UNKNOWN' };
  }
};
