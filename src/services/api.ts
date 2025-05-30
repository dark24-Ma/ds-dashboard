import axios from 'axios';
import { useRouter } from 'vue-router';

// Utiliser l'URL de l'API depuis les variables d'environnement ou une valeur par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2403';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const router = useRouter()

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
        // router.push('/signin')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Vérifier si l'erreur est liée à l'authentification (401 Unauthorized)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Vérifier si le message d'erreur indique un token expiré
      const isExpired = error.response.data && 
        (error.response.data.message?.toLowerCase().includes('expired') ||
         error.response.data.message?.toLowerCase().includes('invalid token') ||
         error.response.data.message?.toLowerCase().includes('jwt'));
         
      if (isExpired || error.response.status === 401) {
        console.log('Token expiré ou invalide, redirection vers la page de connexion');
        
        // Supprimer le token invalide du stockage local
        localStorage.removeItem('auth_token');
        
        // Rediriger vers la page de connexion
        if (router.currentRoute.value.path !== '/signin') {
          router.push('/signin');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;