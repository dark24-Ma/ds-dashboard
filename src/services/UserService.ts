import type { User } from '@/types/User'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  email: string;
  firstname: string;
  name: string;
  sub: string;
  iat: number;
  exp: number;
}

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
    //   console.log(decodedToken)
      
      return {
        email: decodedToken.email,
        firstname: decodedToken.firstname,
        name: decodedToken.name
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      return null
    }
  }

  logout(): void {
    localStorage.removeItem('token')
  }
}

export default new UserService()