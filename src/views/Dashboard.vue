<template>
  <admin-layout>
    <!-- Dashboard Admin -->
    <div v-if="userType === 'admin'">
      <!-- Bannières publicitaires -->
      <banner-carousel />
      
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 space-y-6 xl:col-span-7">
          <ecommerce-metrics />
          <monthly-target />
        </div>
        <div class="col-span-12 xl:col-span-5">
          <monthly-sale />
        </div>

        <div class="col-span-12">
          <statistics-chart />
        </div>

        <div class="col-span-12 xl:col-span-5">
          <customer-demographic />
        </div>

        <div class="col-span-12 xl:col-span-7">
          <recent-orders />
        </div>
      </div>
    </div>

    <!-- Dashboard Client -->
    <div v-else class="mx-auto max-w-screen-2xl px-4 md:px-6 2xl:px-10">
      <!-- Bannière de publicité -->
      <div class="mb-6">
        <banner-carousel />
      </div>

      <!-- Grille principale pour clients -->
      <div class="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
        <!-- Première ligne : Progression et Objectifs -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <user-progress />
          <learning-goals />
        </div>

        <!-- Deuxième ligne : Recommandations Premium -->
        <premium-course-recommendations />

        <!-- Troisième ligne : Success Stories et Upsell -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div class="lg:col-span-2">
            <success-stories />
          </div>
          <div>
            <subscription-upsell />
          </div>
        </div>

        <!-- Quatrième ligne : Activité récente -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <!-- Cours récemment consultés -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
                Continuer l'apprentissage
              </h3>
              <router-link 
                to="/courses" 
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Voir tous les cours
              </router-link>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="course in recentCourses" 
                :key="course.id"
                class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                @click="goToCourse(course.id)"
              >
                <img 
                  :src="course.thumbnail" 
                  :alt="course.title"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800 dark:text-white/90 text-sm">{{ course.title }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ course.progress }}% complété</p>
                  
                  <!-- Barre de progression -->
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-600">
                    <div 
                      class="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      :style="{ width: `${course.progress}%` }"
                    ></div>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ course.lastAccessed }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ course.duration }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conseils du jour -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              💡 Conseils du jour
            </h3>
            
            <div class="space-y-4">
              <!-- Conseil principal -->
              <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-100 dark:border-blue-800/20">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-white/90 text-sm mb-1">
                      {{ dailyTip.title }}
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ dailyTip.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Statistiques personnelles -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-center">
                  <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ studyStreak }}</div>
                  <div class="text-xs text-green-700 dark:text-green-300">Jours consécutifs</div>
                </div>
                
                <div class="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-center">
                  <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ totalHours }}</div>
                  <div class="text-xs text-purple-700 dark:text-purple-300">Heures d'étude</div>
                </div>
              </div>

              <!-- Prochaine session recommandée -->
              <div class="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Session recommandée</span>
                </div>
                <p class="text-xs text-yellow-700 dark:text-yellow-300">
                  Continuez "{{ nextRecommendedCourse }}" - 30 min aujourd'hui pour maintenir votre rythme !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import BannerCarousel from '../components/common/BannerCarousel.vue'

// Composants Admin
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'

// Composants Client
import UserProgress from '../components/client/UserProgress.vue'
import LearningGoals from '../components/client/LearningGoals.vue'
import PremiumCourseRecommendations from '../components/client/PremiumCourseRecommendations.vue'
import SuccessStories from '../components/client/SuccessStories.vue'
import SubscriptionUpsell from '../components/client/SubscriptionUpsell.vue'

const router = useRouter()

// Détection du type d'utilisateur
const userType = ref('client') // Par défaut client, changez en 'admin' pour les administrateurs

// Données pour le dashboard client
const recentCourses = ref([
  {
    id: 1,
    title: "Introduction à Python",
    thumbnail: "/images/cards/card-01.png",
    progress: 75,
    lastAccessed: "Il y a 2h",
    duration: "4h 30min"
  },
  {
    id: 2,
    title: "Bases de données SQL",
    thumbnail: "/images/cards/card-02.jpg",
    progress: 45,
    lastAccessed: "Hier",
    duration: "6h 15min"
  },
  {
    id: 3,
    title: "Design Thinking",
    thumbnail: "/images/cards/card-03.jpg",
    progress: 20,
    lastAccessed: "Il y a 3 jours",
    duration: "3h 45min"
  }
])

const dailyTip = ref({
  title: "Pratiquez régulièrement",
  description: "Dédiez 30 minutes par jour à l'apprentissage pour des résultats optimaux. La régularité est la clé du succès !"
})

const studyStreak = ref(12)
const totalHours = ref(47)
const nextRecommendedCourse = ref("Python pour Data Science")

// Méthodes
const goToCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

const detectUserType = () => {
  // TODO: Implémenter la logique de détection basée sur le JWT token ou le store
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (user.userType === 'admin') {
    userType.value = 'admin'
  } else {
    userType.value = 'client'
  }
}

onMounted(() => {
  detectUserType()
  console.log(`Dashboard chargé pour: ${userType.value}`)
})
</script>
