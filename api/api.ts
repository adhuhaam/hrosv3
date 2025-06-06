import axios from 'axios';
import qs from 'qs';

const BASE_URL = 'https://api.rccmaldives.com/ess';

export interface User {
  id: string;
  name: string;
  designation?: string;
  [key: string]: any;
}

export interface LoginResponse {
  status: 'success' | 'error';
  data?: Record<string, any>;
  message?: string;
}

/**
 * Logs in user with username and password using PHP API
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const form = qs.stringify({ username, password });

    const response = await axios.post(`${BASE_URL}/auth/index.php`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data as LoginResponse;
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.response?.data?.message || 'Network error. Please try again.',
    };
  }
};
