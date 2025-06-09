/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { Subscriber, NewsletterTemplate, SendNewsletterRequest } from '@/types/NewsLetter'
import { useRouter } from 'vue-router'

// const API_URL = 'http://185.97.146.99:2403'  
const API_URL = 'http://localhost:2403'
const router = useRouter()

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenData = localStorage.getItem('token')
    if (tokenData) {
      try {
        const { access_token } = JSON.parse(tokenData)
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`
        }
      } catch (error) {
        console.error('Erreur lors du parsing du token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

class NewsletterService {
  // Gestion des abonnés
  async getSubscribers(): Promise<Subscriber[]> {
    // const token = localStorage.getItem('token');
    // console.log(token.access)
    try {
      const response = await axiosInstance.get('/newsletter/subscribers')
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Gérer l'expiration du token ou l'authentification invalide
        router.push('/signin')
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      throw error
    }
  }

  async addSubscriber(email: string): Promise<Subscriber> {
    const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email })
    return response.data
  }

  async removeSubscriber(email: string): Promise<void> {
    const response = await axios.post(`${API_URL}/newsletter/unsubscribe`, { email })
    return response.data
  }

  // Gestion des templates
  async getTemplates(): Promise<NewsletterTemplate[]> {
    try {
      const response = await axiosInstance.get('/newsletter-templates')
      return response.data
    } catch (error: any) {
      console.error('Erreur lors de la récupération des templates:', error)
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération des templates',
      )
    }
  }

  async getTemplateById(id: string): Promise<NewsletterTemplate> {
    try {
      const response = await axiosInstance.get(`/newsletter-templates/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Erreur lors de la récupération du template:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du template')
    }
  }

  async createTemplate(template: NewsletterTemplate): Promise<NewsletterTemplate> {
    try {
      const response = await axiosInstance.post('/newsletter-templates', template)
      return response.data
    } catch (error: any) {
      console.error('Erreur lors de la création du template:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du template0')
    }
  }

  async updateTemplate(
    id: string,
    template: Partial<NewsletterTemplate>,
  ): Promise<NewsletterTemplate> {
    try {
      const response = await axiosInstance.put(`/newsletter-templates/${id}`, template)
      return response.data
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du template:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du template')
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/newsletter-templates/${id}`)
    } catch (error: any) {
      console.error('Erreur lors de la suppression du template:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du template')
    }
  }

  // Envoi de newsletter
  async sendNewsletter(data: SendNewsletterRequest, id: string): Promise<void> {
    try {
      await axiosInstance.post(`/send-newsletter/${id}`, data)
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la newsletter:", error)
      throw new Error(error.response?.data?.message || "Erreur lors de l'envoi de la newsletter")
    }
  }
}

export default new NewsletterService()
