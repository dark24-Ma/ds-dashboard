/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './api';
import type { Banner, BannerFilterOptions, BannerUploadResponse } from '@/types/Banner';

class BannerService {
  async getBanners(filters?: BannerFilterOptions): Promise<Banner[]> {
    try {
      const params = filters || {};
      const response = await axiosInstance.get('/banners', { params });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des bannières:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des bannières');
    }
  }

  async getActiveBanners(): Promise<Banner[]> {
    try {
      const response = await axiosInstance.get('/banners/active');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des bannières actives:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des bannières actives');
    }
  }

  async getBannerById(id: string): Promise<Banner> {
    try {
      const response = await axiosInstance.get(`/banners/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la bannière:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la bannière');
    }
  }

  async createBanner(bannerData: FormData): Promise<Banner> {
    try {
      const response = await axiosInstance.post('/banners', bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la bannière:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la bannière');
    }
  }

  async updateBanner(id: string, bannerData: FormData): Promise<Banner> {
    try {
      const response = await axiosInstance.put(`/banners/${id}`, bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la bannière:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la bannière');
    }
  }

  async deleteBanner(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/banners/${id}`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la bannière:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la bannière');
    }
  }

  async toggleBannerStatus(id: string): Promise<Banner> {
    try {
      const response = await axiosInstance.patch(`/banners/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du changement de statut de la bannière:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du changement de statut de la bannière');
    }
  }

  async updateBannerOrder(banners: { id: string, displayOrder: number }[]): Promise<void> {
    try {
      await axiosInstance.put('/banners/order', { banners });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'ordre des bannières:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'ordre des bannières');
    }
  }

  async trackBannerClick(id: string): Promise<void> {
    try {
      await axiosInstance.post(`/banners/${id}/click`);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du clic:', error);
      // Ne pas throw l'erreur pour ne pas interrompre l'expérience utilisateur
    }
  }

  async trackBannerImpression(id: string): Promise<void> {
    try {
      await axiosInstance.post(`/banners/${id}/impression`);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement de l\'impression:', error);
      // Ne pas throw l'erreur pour ne pas interrompre l'expérience utilisateur
    }
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return '/images/banner/default-banner.jpg'; // Image par défaut
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Utiliser l'URL de l'API ou une valeur par défaut
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:2403';
    const fullUrl = `${apiUrl}/uploads/${imageUrl}`;
    
    // Debug: afficher l'URL construite
    console.log('URL d\'image construite:', fullUrl);
    
    return fullUrl;
  }
}

export default new BannerService(); 