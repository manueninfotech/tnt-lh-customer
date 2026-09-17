import api from './api';

const settingsService = {
    getSettings: async () => {
        const response = await api.get('/customer/settings');
        return response.data;
    },
    getBrandsStatus: async () => {
        const response = await api.get('/customer/settings/brands-status');
        return response.data;
    }
};

export default settingsService;
