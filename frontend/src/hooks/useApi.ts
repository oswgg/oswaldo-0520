import { api } from '../data/api';

export const useApi = () => {
    return {
        get: <T>(url: string, config?: any) => api.get<T>(url, config),
        post: <T>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
        put: <T>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
        delete: <T>(url: string, config?: any) => api.delete<T>(url, config),
    };
};
