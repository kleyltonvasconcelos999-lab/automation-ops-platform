import axios, { AxiosInstance } from 'axios';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let apiInstance: AxiosInstance | null = null;

const getApiInstance = () => {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    apiInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  return apiInstance;
};

export const useApi = () => {
  const api = getApiInstance();

  const get = useCallback(async (url: string, config?: any) => {
    return api.get(url, config);
  }, [api]);

  const post = useCallback(async (url: string, data?: any, config?: any) => {
    return api.post(url, data, config);
  }, [api]);

  const put = useCallback(async (url: string, data?: any, config?: any) => {
    return api.put(url, data, config);
  }, [api]);

  const patch = useCallback(async (url: string, data?: any, config?: any) => {
    return api.patch(url, data, config);
  }, [api]);

  const delete_ = useCallback(async (url: string, config?: any) => {
    return api.delete(url, config);
  }, [api]);

  return { get, post, put, patch, delete: delete_ };
};

export default useApi;
