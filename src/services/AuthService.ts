import axios from 'axios'
import { useRouter } from 'vue-router'

const API_LOCAL = 'http://localhost:3000'
const router = useRouter()

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_LOCAL}/auth/login`, { email, password })
    if (response.data) {
      // localStorage.setItem('user',JSON.stringify(response.data));
      console.log(response)
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

  async logout() {
    localStorage.removeItem('user');
    router.push('/signin')
  }
}

export default new AuthService()
