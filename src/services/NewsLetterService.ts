import axios from "axios";
import type { Subscriber, NewsletterTemplate } from "@/types/NewsLetter";
import { useRouter } from "vue-router";

const API_URL = 'http://localhost:3000' 
const router = useRouter()

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Intercepteur pour ajouter le token JWT à chaque requête
  axiosInstance.interceptors.request.use(
    (config) => {
      const tokenData = localStorage.getItem('token');
      if (tokenData) {
        try {
          const { access_token } = JSON.parse(tokenData);
          if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
          }
        } catch (error) {
          console.error('Erreur lors du parsing du token:', error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


class NewsletterService {
    // Gestion des abonnés
    async getSubscribers(): Promise<Subscriber[]> {
        // const token = localStorage.getItem('token');
        // console.log(token.access)
        try {
          const response = await axiosInstance.get('/newsletter/subscribers');
          return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Gérer l'expiration du token ou l'authentification invalide
            router.push('/signin')
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }
          throw error;
        }
      }
  
    async addSubscriber(email: string): Promise<Subscriber> {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      return response.data;
    }
  
    async removeSubscriber(email: string): Promise<void> {
        const response =  await axios.post(`${API_URL}/newsletter/unsubscribe`, { email });
        return response.data;
    }
  
    // Gestion des templates
    async getTemplates(): Promise<NewsletterTemplate[]> {
      const response = await axios.get(`${API_URL}/templates`);
      return response.data;
    }
  
    async createTemplate(template: Partial<NewsletterTemplate>): Promise<NewsletterTemplate> {
      const response = await axios.post(`${API_URL}/templates`, template);
      return response.data;
    }
  
    // Envoi de newsletter
    async sendNewsletter(templateId: number, subscriberIds?: number[]) {
      const response = await axios.post(`${API_URL}/send`, {
        templateId,
        subscriberIds // Optionnel: pour envoyer à des abonnés spécifiques
      });
      return response.data;
    }
  }
  
  export default new NewsletterService();