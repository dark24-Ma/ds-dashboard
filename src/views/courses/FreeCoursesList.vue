<template>
  <admin-layout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold dark:text-white mb-6">Cours en accès libre</h1>
      
      <!-- Chargement -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="spinner"></div>
      </div>
  
      <!-- Erreur -->
      <div v-else-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>
      
      <!-- Aucun cours -->
      <div v-else-if="courses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">Aucun cours en accès libre disponible pour le moment.</p>
      </div>
  
      <!-- Liste des cours -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in courses" :key="course.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="relative h-48">
            <img 
              :src="getImageUrl(course.thumbnailUrl)" 
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 bg-brand-500 text-white text-xs rounded-full">
                {{ course.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}
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
                <button @click="viewCourse(course.id)" 
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                  Visualiser
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
import { ref, onMounted } from 'vue';
import CourseService from '@/services/CourseService';
import type { Course } from '@/types/Course';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useRouter } from 'vue-router';

const courses = ref<Course[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();

// Ajoutez une constante pour l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://185.97.146.99:2403';

onMounted(async () => {
  try {
    courses.value = await CourseService.getFreeCourses();
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des cours: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const getImageUrl = (url?: string) => {
  if (!url) return '/placeholder-image.jpg';
  
  // Si l'URL est relative, ajouter l'URL de base de l'API
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  return url;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-image.jpg'; // Image par défaut en cas d'erreur
};

const viewCourse = (id?: string) => {
  if (!id) return;
  router.push(`/courses/${id}/view`);
};

const downloadCourse = async (id?: string) => {
  // Cette fonction n'est plus utilisée, mais conservée pour référence
  if (!id) return;
  
  try {
    const blob = await CourseService.downloadCourse(id);
    
    // Créer un URL pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Créer un lien et déclencher le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `cours-${id}`; // Nom de fichier par défaut
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err: any) {
    alert('Erreur lors du téléchargement du cours: ' + err.message);
  }
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