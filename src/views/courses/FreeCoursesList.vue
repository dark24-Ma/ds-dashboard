<template>
  <admin-layout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold dark:text-white">Cours en accès libre</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Découvrez nos cours gratuits et commencez votre apprentissage dès maintenant.
        </p>
      </div>

      <!-- Filtres de recherche -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Recherche
            </label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Rechercher par titre ou description..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @input="applyFilters"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Type de ressource
            </label>
            <select 
              v-model="filters.resourceType" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="applyFilters"
            >
              <option value="">Tous les types</option>
              <option value="pdf">PDF</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Message de chargement -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>

      <!-- Message si aucun cours -->
      <div v-else-if="courses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">Aucun cours gratuit disponible pour le moment.</p>
      </div>

      <!-- Liste des cours -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in courses" :key="course.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
          <div class="relative h-48">
            <img 
              :src="getImageUrl(course.thumbnailUrl)" 
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Gratuit
              </span>
            </div>
            <div class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-brand-500 text-white text-xs rounded-full">
                {{ course.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}
              </span>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">{{ course.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">{{ course.description }}</p>
            
            <div v-if="course.tags && course.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
              <span v-for="tag in course.tags.slice(0, 3)" :key="tag" 
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                {{ tag }}
              </span>
              <span v-if="course.tags.length > 3" 
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{{ course.tags.length - 3 }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ course.duration }} min
              </span>
              
              <button @click="viewCourse(course.id)" 
                class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                Voir le cours
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to action pour l'abonnement -->
      <div v-if="courses.length > 0" class="mt-12 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg shadow p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">Vous voulez accéder à plus de cours ?</h2>
        <p class="text-brand-100 mb-6">
          Découvrez notre catalogue complet avec des centaines de cours premium et un accompagnement personnalisé.
        </p>
        <button @click="navigateToSubscription" 
          class="px-6 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Découvrir nos abonnements
        </button>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import CourseService from '@/services/CourseService';
import type { Course, CourseFilter } from '@/types/Course';

const router = useRouter();
const courses = ref<Course[]>([]);
const loading = ref(true);

const filters = reactive<CourseFilter>({
  search: '',
  resourceType: undefined,
  tags: []
});

// Déclaration pour window.searchTimeout
declare global {
  interface Window {
    searchTimeout: number;
  }
}

const allFreeCourses = ref<Course[]>([]);

const loadFreeCourses = async () => {
  try {
    loading.value = true;
    const freeCourses = await CourseService.getFreeCourses();
    allFreeCourses.value = freeCourses;
    applyClientFilters();
  } catch (error) {
    console.error('Erreur lors du chargement des cours gratuits:', error);
  } finally {
    loading.value = false;
  }
};

const applyClientFilters = () => {
  let filtered = [...allFreeCourses.value];
  
  // Filtrage par recherche
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Filtrage par type de ressource
  if (filters.resourceType) {
    filtered = filtered.filter(course => course.resourceType === filters.resourceType);
  }
  
  courses.value = filtered;
};

const applyFilters = () => {
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout);
  }
  
  window.searchTimeout = window.setTimeout(() => {
    applyClientFilters();
  }, 500);
};

const getImageUrl = (thumbnailUrl: string | undefined) => {
  if (!thumbnailUrl) {
    return '/images/cards/card-01.png'; // Image par défaut
  }
  
  if (thumbnailUrl.startsWith('http')) {
    return thumbnailUrl;
  }
  
  return `${import.meta.env.VITE_API_URL}/uploads/${thumbnailUrl}`;
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/cards/card-01.png';
};

const viewCourse = (courseId: string) => {
  router.push(`/course-viewer/${courseId}`);
};

const navigateToSubscription = () => {
  router.push('/subscription-types');
};

onMounted(() => {
  loadFreeCourses();
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 