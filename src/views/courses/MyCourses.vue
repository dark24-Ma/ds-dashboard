<template>
  <admin-layout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold dark:text-white">Mes Cours</h1>
        
        <!-- Information sur l'abonnement -->
        <div v-if="userSubscription" class="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg">
          <span class="text-sm text-blue-700 dark:text-blue-300">
            Abonnement: <strong>{{ userSubscription.subscriptionType }}</strong>
          </span>
          <span v-if="userSubscription.endDate" class="text-xs text-blue-600 dark:text-blue-400 ml-2">
            (jusqu'au {{ formatDate(userSubscription.endDate) }})
          </span>
        </div>
        <div v-else class="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
          <span class="text-sm text-gray-600 dark:text-gray-400">Aucun abonnement actif</span>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mb-6 flex flex-wrap gap-4">
        <select v-model="accessFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="all">Tous les cours</option>
          <option value="accessible">Cours accessibles</option>
          <option value="restricted">Cours restreints</option>
          <option value="free">Cours gratuits</option>
          <option value="premium">Cours premium</option>
        </select>

        <select v-model="typeFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="video">Vidéo</option>
          <option value="link">Lien</option>
        </select>
      </div>
      
      <!-- Chargement -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="spinner"></div>
      </div>
  
      <!-- Erreur -->
      <div v-else-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>
      
      <!-- Aucun cours -->
      <div v-else-if="filteredCourses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">Aucun cours disponible selon vos critères.</p>
        <p v-if="!userSubscription" class="text-sm text-blue-600 dark:text-blue-400 mt-2">
          <router-link to="/profile" class="underline">Souscrivez à un abonnement</router-link> pour accéder à plus de cours.
        </p>
      </div>
  
      <!-- Liste des cours -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in filteredCourses" :key="course.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
          
          <!-- Badge d'accès -->
          <div class="absolute top-2 left-2 z-10">
            <span v-if="course.accessType === 'free'" 
              class="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Gratuit
            </span>
            <span v-else-if="course.hasAccess" 
              class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              Accessible
            </span>
            <span v-else 
              class="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              Restreint
            </span>
          </div>

          <!-- Overlay pour les cours restreints -->
          <div v-if="!course.hasAccess && course.accessType === 'premium'" 
            class="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
            <div class="text-center text-white p-4">
              <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm">Abonnement requis</p>
              <router-link to="/profile" 
                class="text-blue-300 hover:text-blue-100 text-xs underline mt-1 block">
                Voir les abonnements
              </router-link>
            </div>
          </div>
          
          <div class="relative h-48">
            <img 
              :src="getImageUrl(course.thumbnailUrl)" 
              :alt="course.title"
              class="w-full h-full object-cover"
              :class="{ 'opacity-50': !course.hasAccess && course.accessType === 'premium' }"
              @error="handleImageError"
            />
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 bg-brand-500 text-white text-xs rounded-full">
                {{ course.resourceType === 'pdf' ? 'PDF' : course.resourceType === 'video' ? 'Vidéo' : 'Lien' }}
              </span>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">{{ course.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">{{ course.description }}</p>
            
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="tag in course.tags" :key="tag" 
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                {{ tag }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ course.duration }} min</span>
              
              <div class="flex space-x-2">
                <button v-if="course.hasAccess" @click="viewCourse(course.id)" 
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                  Visualiser
                </button>
                <button v-else @click="$router.push('/profile')"
                  class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import CourseService from '@/services/CourseService';
import type { Course } from '@/types/Course';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useRouter } from 'vue-router';

const courses = ref<Course[]>([]);
const userSubscription = ref<any>(null);
const loading = ref(true);
const error = ref('');
const router = useRouter();

// Filtres
const accessFilter = ref('all');
const typeFilter = ref('');

// URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://185.97.146.99:2403';

onMounted(async () => {
  try {
    const response = await CourseService.getAccessibleCourses();
    courses.value = response.courses;
    userSubscription.value = response.userSubscription;
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des cours: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const filteredCourses = computed(() => {
  let filtered = courses.value;

  // Filtre par accès
  if (accessFilter.value !== 'all') {
    filtered = filtered.filter(course => {
      switch (accessFilter.value) {
        case 'accessible':
          return course.hasAccess;
        case 'restricted':
          return !course.hasAccess;
        case 'free':
          return course.accessType === 'free';
        case 'premium':
          return course.accessType === 'premium';
        default:
          return true;
      }
    });
  }

  // Filtre par type
  if (typeFilter.value) {
    filtered = filtered.filter(course => course.resourceType === typeFilter.value);
  }

  return filtered;
});

const getImageUrl = (url?: string) => {
  if (!url) return '/placeholder-image.jpg';
  
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  return url;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-image.jpg';
};

const viewCourse = (id?: string) => {
  if (!id) return;
  router.push(`/courses/${id}/view`);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 