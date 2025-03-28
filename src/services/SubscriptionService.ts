import axiosInstance from './api';
import UserService from './UserService';
import type { SubscriptionType, UserSubscription, SubscribeUserRequest } from '@/types/Subscription';
import type { User } from '@/types/User';

export default {
  // Types d'abonnement
  getSubscriptionTypes(): Promise<SubscriptionType[]> {
    return axiosInstance.get('/subscription-types').then(response => response.data);
  },

  getSubscriptionTypeById(id: string): Promise<SubscriptionType> {
    return axiosInstance.get(`/subscription-types/${id}`).then(response => response.data);
  },

  createSubscriptionType(subscriptionType: SubscriptionType): Promise<SubscriptionType> {
    return axiosInstance.post('/subscription-types', subscriptionType).then(response => response.data);
  },

  updateSubscriptionType(id: string, subscriptionType: Partial<SubscriptionType>): Promise<SubscriptionType> {
    return axiosInstance.put(`/subscription-types/${id}`, subscriptionType).then(response => response.data);
  },

  deleteSubscriptionType(id: string): Promise<void> {
    return axiosInstance.delete(`/subscription-types/${id}`);
  },

  // Abonnements utilisateur
  async getUserSubscriptionsWithDetails(): Promise<UserSubscription[]> {
    // Récupérer les abonnements basiques (avec seulement les IDs)
    const subscriptions = await axiosInstance.get('/user-subscriptions').then(response => response.data);
    
    // Récupérer tous les utilisateurs en une seule requête pour optimiser
    const users = await UserService.getUsers();
    
    // Enrichir les données d'abonnement avec les informations complètes des utilisateurs
    return subscriptions.map((subscription: any) => {
      const user = users.find((u: User) => u.id === subscription.userId || u._id === subscription.userId);
      
      return {
        ...subscription,
        user: user ? {
          id: user._id || user._id,
          firstname: user.firstname,
          name: user.name,
          email: user.email
        } : { id: subscription.userId, firstName: "N/A", lastName: "", email: "" }
      };
    });
  },

  subscribeUser(subscription: SubscribeUserRequest): Promise<UserSubscription> {
    return axiosInstance.post('/user-subscriptions/subscribe', subscription).then(response => response.data);
  },

  cancelSubscription(subscriptionId: string): Promise<void> {
    return axiosInstance.post(`/user-subscriptions/${subscriptionId}/cancel`);
  },

  renewSubscription(subscription: SubscribeUserRequest): Promise<UserSubscription> {
    return axiosInstance.post('/user-subscriptions/renew', subscription).then(response => response.data);
  }
};