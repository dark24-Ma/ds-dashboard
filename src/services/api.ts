import axios from 'axios';


const API_URL = 'https://ds-api-zeta.vercel.app'
// const API_URL = 'http://localhost:3000'
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

export default axiosInstance;