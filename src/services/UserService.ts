import type { User } from '@/types/User'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  email: string
  firstname: string
  name: string
  userType: string
  phonenumber: string
  sub: string
  iat: number
  exp: number
}

// const API_URL = 'http://185.97.146.99:2403'
const API_URL = 'http://localhost:2403'
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
class UserService {
  getCurrentUser(): User | null {
    try {
      const tokenData = localStorage.getItem('token')
      if (!tokenData) {
        return null
      }

      const { access_token } = JSON.parse(tokenData)
      if (!access_token) {
        return null
      }

      // Décoder le token pour obtenir les informations utilisateur
      const decodedToken = jwtDecode<JWTPayload>(access_token)
      console.log(decodedToken)

      return {
        email: decodedToken.email,
        firstname: decodedToken.firstname,
        name: decodedToken.name,
        userType: decodedToken.userType,
        phonenumber: decodedToken.phonenumber,
        id: decodedToken.sub,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      return null
    }
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      // Récupérer l'utilisateur actuel et son ID
      const currentUser = this.getCurrentUser()
      if (!currentUser || !currentUser.id) {
        throw new Error('Aucun utilisateur connecté ou ID manquant')
      }

      // Appel à l'API pour mettre à jour les informations avec l'ID dans l'URL
      const response = await axiosInstance.put(`/user/${currentUser.id}`, userData)
      
      // Traiter la réponse
      const updatedUserData = response.data.user || {}
      
      // Mise à jour du token si le backend renvoie un nouveau token
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', JSON.stringify({ 
          access_token: response.data.access_token 
        }))
        
        // Forcer l'actualisation des données en cache
        this.clearUserCache()
      }
      
      // Retourner les données utilisateur mises à jour
      return updatedUserData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil')
    }
  }

  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get('/user')
    console.log(response.data)
    return response.data
  }

  logout(): void {
    localStorage.removeItem('token')
  }

  //Todo
  clearUserCache(): void {
  }
}

export default new UserService()
