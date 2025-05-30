<template>
  <admin-layout>
    <div class="p-6">
      <div class="mb-6 flex items-center">
        <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-semibold dark:text-white">{{ course.title }}</h1>
      </div>

      <div v-if="loading" class="flex justify-center my-8">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>
      
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <!-- En-tête du cours -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <span :class="{
                'bg-blue-100 text-blue-800': course.resourceType === 'pdf',
                'bg-purple-100 text-purple-800': course.resourceType === 'video'
              }" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ course.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}
              </span>
              <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {{ course.duration }} minutes
              </span>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-4">{{ course.description }}</p>

          <div class="flex flex-wrap gap-2">
            <span v-for="tag in course.tags" :key="tag" 
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Contenu du cours -->
        <div class="p-6">
          <!-- Affichage du PDF -->
          <div v-if="course.resourceType === 'pdf'" class="w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <div class="relative" style="padding-top: 100vh;">
              <iframe 
                ref="pdfViewer"
                :src="resourceUrl" 
                class="absolute top-0 left-0 w-full h-full"
                style="pointer-events: auto;"
              ></iframe>
            </div>
            <div class="mt-4 text-center text-sm text-gray-500">
              Ce document est protégé et ne peut pas être téléchargé.
            </div>
          </div>

          <!-- Affichage de la vidéo -->
          <div v-else-if="course.resourceType === 'video'" class="w-full bg-black rounded-lg overflow-hidden">
            <div class="relative" style="padding-top: 56.25%;">
              <video 
                ref="videoPlayer"
                class="absolute top-0 left-0 w-full h-full"
                controls
                controlsList="nodownload"
                disablePictureInPicture
                @contextmenu.prevent
              >
                <source :src="resourceUrl" :type="videoType">
                Votre navigateur ne supporte pas la lecture de cette vidéo.
              </video>
            </div>
            <div class="mt-4 text-center text-sm text-gray-500">
              Cette vidéo est protégée et ne peut pas être téléchargée.
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import CourseService from '@/services/CourseService';
import type { Course } from '@/types/Course';
import axiosInstance from '@/services/api';

const router = useRouter();
const route = useRoute();
const courseId = route.params.id as string;

const course = ref<Course>({
  title: '',
  description: '',
  resourceType: 'pdf',
  tags: [],
  accessibleTo: [],
  duration: 0
});

const loading = ref(true);
const error = ref('');
const pdfViewer = ref<HTMLIFrameElement | null>(null);
const videoPlayer = ref<HTMLVideoElement | null>(null);

// Récupérer l'URL de base de l'API depuis la configuration d'axios
const API_BASE_URL = axiosInstance.defaults.baseURL || 'http://localhost:2403';

// URL sécurisée pour accéder à la ressource
const resourceUrl = computed(() => {
  if (!course.value.id) return '';
  
  // Utiliser un endpoint sécurisé qui génère un lien temporaire
  return `${API_BASE_URL}/courses/${course.value.id}/view`;
});

// Déterminer le type MIME de la vidéo
const videoType = computed(() => {
  // Déterminer le type MIME en fonction de l'extension du fichier
  const fileExtension = course.value.fileName?.split('.').pop()?.toLowerCase() || '';
  
  switch (fileExtension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    default:
      return 'video/mp4'; // Par défaut
  }
});

onMounted(async () => {
  try {
    // Charger les informations du cours
    course.value = await CourseService.getCourseById(courseId);
    
    // Ajouter des protections contre le téléchargement
    if (course.value.resourceType === 'pdf' && pdfViewer.value) {
      // Désactiver le clic droit sur l'iframe
      pdfViewer.value.oncontextmenu = (e) => e.preventDefault();
    }
    
    if (course.value.resourceType === 'video' && videoPlayer.value) {
      // Ajouter d'autres protections pour la vidéo si nécessaire
      videoPlayer.value.oncontextmenu = (e) => e.preventDefault();
    }
    
  } catch (err: any) {
    error.value = 'Erreur lors du chargement du cours: ' + err.message;
  } finally {
    loading.value = false;
  }
});

// Ajouter des protections contre le téléchargement
onMounted(() => {
  // Désactiver le clic droit sur toute la page
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  // Désactiver les raccourcis clavier courants pour le téléchargement
  document.addEventListener('keydown', (e) => {
    // Ctrl+S, Ctrl+P, F12
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'p')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
    }
  });
});
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
</style> 