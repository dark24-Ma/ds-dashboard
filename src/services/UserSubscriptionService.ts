import axiosInstance from './api';
import type { UserSubscription } from '@/types/Subscription';

export default {
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await axiosInstance.get(`/user-subscriptions/details/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async hasActiveSubscription(): Promise<boolean> {
    try {
      // Obtenir l'utilisateur courant depuis le localStorage
      const tokenData = localStorage.getItem('token');
      if (!tokenData) return false;

      const { access_token } = JSON.parse(tokenData);
      if (!access_token) return false;

      // Décoder le token pour obtenir l'ID utilisateur
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const userId = payload.sub;

      const response = await axiosInstance.get(`/user-subscriptions/check/${userId}`);
      return response.data.hasActiveSubscription;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  }
}; 