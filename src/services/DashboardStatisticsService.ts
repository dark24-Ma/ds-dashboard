import api from './api';

export interface EcommerceMetrics {
  customers: {
    total: number;
    growth: number;
    isPositive: boolean;
  };
  orders: {
    total: number;
    growth: number;
    isPositive: boolean;
  };
}

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartData {
  series: ChartSeries[];
}

export interface DemographicData {
  userTypes: Array<{
    name: string;
    value: number;
  }>;
  subscriptionStatus: Array<{
    name: string;
    value: number;
  }>;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  email: string;
  subscriptionType: string;
  amount: number;
  status: string;
  date: string;
}

class DashboardStatisticsService {
  async getEcommerceMetrics(): Promise<EcommerceMetrics> {
    try {
      const response = await api.get('/dashboard-statistics/ecommerce-metrics');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques ecommerce:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        customers: { total: 0, growth: 0, isPositive: true },
        orders: { total: 0, growth: 0, isPositive: true }
      };
    }
  }

  async getMonthlySalesData(): Promise<ChartData> {
    try {
      const response = await api.get('/dashboard-statistics/monthly-sales');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes mensuelles:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        series: [{
          name: 'Souscriptions',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      };
    }
  }

  async getStatisticsChartData(): Promise<ChartData> {
    try {
      const response = await api.get('/dashboard-statistics/statistics-chart');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        series: [
          {
            name: 'Ventes',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: 'Revenus',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      };
    }
  }

  async getCustomerDemographicData(): Promise<DemographicData> {
    try {
      const response = await api.get('/dashboard-statistics/customer-demographic');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données démographiques:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        userTypes: [],
        subscriptionStatus: []
      };
    }
  }

  async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const response = await api.get('/dashboard-statistics/recent-orders');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes récentes:', error);
      // Retourner des données par défaut en cas d'erreur
      return [];
    }
  }

  async getMonthlyTargetData(): Promise<ChartData> {
    try {
      const response = await api.get('/dashboard-statistics/monthly-target');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des objectifs mensuels:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        series: [{
          name: 'Objectifs',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      };
    }
  }
}

export default new DashboardStatisticsService(); 