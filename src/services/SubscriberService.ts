/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Subscriber } from '@/types/NewsLetter';
import axiosInstance from './api';
// import type { Subscriber } from '@/types/Newsletter';

class SubscriberService {
  async getSubscribers(): Promise<Subscriber[]> {
    try {
      const response = await axiosInstance.get('/newsletter/subscribers');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des abonnés');
    }
  }

  async addSubscriber(email: string): Promise<Subscriber> {
    try {
      const response = await axiosInstance.post('/newsletter/subscribers', { email });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'abonné:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'abonné');
    }
  }

  async removeSubscriber(email: string): Promise<void> {
    try {
      await axiosInstance.delete(`/newsletter/subscribers/${email}`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'abonné:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'abonné');
    }
  }
}

export default new SubscriberService();