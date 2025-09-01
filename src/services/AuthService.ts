import axios from 'axios'
import { useRouter } from 'vue-router'

// const API_LOCAL = 'http://185.97.146.99:2403'
const API_LOCAL = import.meta.env.VITE_API_URL /* 'http://localhost:2403'  */

const router = useRouter()

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_LOCAL}/auth/login`, { email, password })
    if (response.data?.access_token) {
      localStorage.setItem('token', JSON.stringify({ access_token: response.data.access_token }))

    }
    return response
  }

  async register(name: string, email: string, password: string, firstname: string) {
    const response = await axios.post(`${API_LOCAL}/auth/register`, {
      name,
      email,
      password,
      firstname,
    })
    if (response.data) {
      // console.log(response)
    }
    return response
  }

  getToken(): string | null {
    const tokenData = localStorage.getItem('token')
    if (tokenData) {
      const { access_token } = JSON.parse(tokenData)
      return access_token
    }
    return null
  }

  logout(): void {
    localStorage.removeItem('token')
    router.push('/signin')
  }

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_LOCAL}/auth/request-reset-password`, {email: email})
    if (response.data) {

    }
    return response;
  }

  async resetPassword(token: string, newPassword: string) {
    console.log(token, newPassword)
    const response = await axios.put(`${API_LOCAL}/auth/reset-password`, { resetToken: token, password: newPassword})
    // if (res)
    return response;
  }
}

export default new AuthService()
