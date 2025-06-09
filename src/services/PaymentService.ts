import axiosInstance from './api';

export interface UpgradePaymentRequest {
  userId: string;
  newSubscriptionTypeId: string;
  phone?: string;
  network?: 'FLOOZ' | 'TMONEY';
}

export interface PaymentResponse {
  paymentUrl: string;
  identifier: string;
  amount: number;
  description: string;
}

export interface PaymentStatusResponse {
  identifier: string;
  status: string;
  details: any;
}

export default {
  /**
   * Initier un paiement pour un upgrade d'abonnement
   */
  async initiateUpgradePayment(request: UpgradePaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('=== DEBUG PAYMENT REQUEST ===');
      console.log('Request data:', request);
      console.log('userId:', request.userId);
      console.log('newSubscriptionTypeId:', request.newSubscriptionTypeId);
      console.log('============================');
      
      const response = await axiosInstance.post('/payments/subscription/upgrade', request);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'initiation du paiement d\'upgrade:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement');
    }
  },

  /**
   * Initier un paiement pour un nouvel abonnement
   */
  async initiateNewSubscriptionPayment(request: UpgradePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axiosInstance.post('/payments/subscription/new', request);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'initiation du paiement d\'abonnement:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement');
    }
  },

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(identifier: string): Promise<PaymentStatusResponse> {
    try {
      const response = await axiosInstance.get(`/payments/status/${identifier}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la vérification du statut:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut');
    }
  },

  /**
   * Rediriger vers PayGate pour le paiement
   */
  redirectToPayment(paymentUrl: string): void {
    // Utiliser window.location pour rediriger vers PayGate
    window.location.href = paymentUrl;
  },

  /**
   * Sauvegarder l'identifier de paiement en cours
   */
  savePaymentIdentifier(identifier: string): void {
    localStorage.setItem('currentPaymentIdentifier', identifier);
  },

  /**
   * Récupérer l'identifier de paiement en cours
   */
  getCurrentPaymentIdentifier(): string | null {
    return localStorage.getItem('currentPaymentIdentifier');
  },

  /**
   * Supprimer l'identifier de paiement
   */
  clearPaymentIdentifier(): void {
    localStorage.removeItem('currentPaymentIdentifier');
  }
}; 