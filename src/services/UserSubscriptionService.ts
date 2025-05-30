import axiosInstance from './api';
import UserService from './UserService';

class UserSubscriptionService {
  /**
   * Vérifie si l'utilisateur courant a un abonnement actif
   * @returns {Promise<boolean>} True si l'utilisateur a un abonnement actif, false sinon
   */
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const currentUser = UserService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        return false;
      }

      // Appel à l'API pour vérifier l'abonnement de l'utilisateur
      const response = await axiosInstance.get(`/user-subscriptions/check/${currentUser.id}`);
      return response.data.hasActiveSubscription === true;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  }
}

export default new UserSubscriptionService(); 