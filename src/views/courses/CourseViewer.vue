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
      
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Barre latérale avec la liste des ressources -->
        <div class="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Contenu du cours</h2>
          
          <div class="space-y-2">
            <!-- Option: Ressource principale (si existe) -->
            <div 
              v-if="course.resourceType && course.resourceUrl" 
              @click="selectResource(null)"
              :class="[
                'p-3 rounded-lg cursor-pointer flex items-center',
                !selectedResourceId ? 'bg-brand-50 text-brand-700 dark:bg-gray-700 dark:text-brand-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="mr-2">
                <svg v-if="course.resourceType === 'pdf'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="course.resourceType === 'video'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div class="flex-1">
                <p class="font-medium">Introduction</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ course.duration }} min · {{ course.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}</p>
              </div>
            </div>
            
            <!-- Liste des ressources supplémentaires -->
            <div 
              v-for="resource in sortedResources" 
              :key="resource.id ?? ''"
              @click="selectResource(resource.id ?? null)"
              :class="[
                'p-3 rounded-lg cursor-pointer flex items-center',
                selectedResourceId === resource.id ? 'bg-brand-50 text-brand-700 dark:bg-gray-700 dark:text-brand-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="mr-2">
                <svg v-if="resource.resourceType === 'pdf'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="resource.resourceType === 'video'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div class="flex-1">
                <p class="font-medium">{{ resource.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ resource.duration }} min · {{ resource.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contenu du cours -->
        <div class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <!-- En-tête de la ressource active -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold dark:text-white">{{ activeResourceTitle }}</h2>
            <div class="flex items-center mt-2">
              <span :class="{
                'bg-blue-100 text-blue-800': activeResourceType === 'pdf',
                'bg-purple-100 text-purple-800': activeResourceType === 'video'
              }" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ activeResourceType === 'pdf' ? 'PDF' : 'Vidéo' }}
              </span>
              <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {{ activeResourceDuration }} minutes
              </span>
            </div>
          </div>
          
          <!-- Contenu de la ressource -->
          <div class="p-6">
            <!-- Affichage du PDF -->
            <div v-if="activeResourceType === 'pdf'" class="w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div class="relative pdf-container" style="padding-top: 100vh;">
                <iframe 
                  ref="pdfViewer"
                  :src="resourceUrl" 
                  class="absolute top-0 left-0 w-full h-full"
                  style="pointer-events: auto;"
                  @contextmenu.prevent
                ></iframe>
                
                <!-- Overlay transparent pour empêcher certaines interactions -->
                <div class="pdf-protection-overlay"></div>
              </div>
              <div class="mt-4 text-center text-sm text-gray-500">
                Ce document est protégé et ne peut pas être téléchargé.
              </div>
            </div>

            <!-- Affichage de la vidéo -->
            <div v-else-if="activeResourceType === 'video'" class="w-full bg-black rounded-lg overflow-hidden">
              <div class="relative" style="padding-top: 56.25%;">
                <video 
                  ref="videoPlayer"
                  class="absolute top-0 left-0 w-full h-full"
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback"
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
            
            <!-- Navigation entre les ressources -->
            <div class="mt-6 flex justify-between">
              <button 
                v-if="hasPreviousResource" 
                @click="navigateToPreviousResource"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>
              <div v-else></div>
              
              <button 
                v-if="hasNextResource" 
                @click="navigateToNextResource"
                class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center"
              >
                Suivant
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div v-else></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import CourseService from '@/services/CourseService';
import type { Course, CourseResource } from '@/types/Course';
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
  duration: 0,
  resources: []
});

const loading = ref(true);
const error = ref('');
const pdfViewer = ref<HTMLIFrameElement | null>(null);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const selectedResourceId = ref<string | null>(null);

// Récupérer l'URL de base de l'API depuis la configuration d'axios
const API_BASE_URL = axiosInstance.defaults.baseURL || 'http://localhost:2403';

// Trier les ressources par ordre
const sortedResources = computed(() => {
  if (!course.value.resources) return [];
  return [...course.value.resources].sort((a, b) => a.order - b.order);
});

// Déterminer la ressource active
const activeResource = computed(() => {
  if (selectedResourceId.value && course.value.resources) {
    return course.value.resources.find(r => r.id === selectedResourceId.value);
  }
  return null;
});

// Propriétés de la ressource active
const activeResourceTitle = computed(() => {
  if (activeResource.value) {
    return activeResource.value.title;
  }
  return course.value.title;
});

const activeResourceType = computed(() => {
  if (activeResource.value) {
    return activeResource.value.resourceType;
  }
  return course.value.resourceType;
});

const activeResourceDuration = computed(() => {
  if (activeResource.value) {
    return activeResource.value.duration;
  }
  return course.value.duration;
});

// URL sécurisée pour accéder à la ressource
const resourceUrl = computed(() => {
  if (!course.value.id) return '';
  
  // Ajouter un paramètre de cache-busting pour éviter la mise en cache du navigateur
  const cacheBuster = Date.now();
  
  // Construire l'URL en fonction de la ressource sélectionnée
  let url = `${API_BASE_URL}/courses/${course.value.id}/view?nocache=${cacheBuster}`;
  
  if (selectedResourceId.value) {
    url += `&resourceId=${selectedResourceId.value}`;
  }
  
  return url;
});

// Déterminer le type MIME de la vidéo
const videoType = computed(() => {
  // Déterminer le type MIME en fonction de l'extension du fichier
  let fileName = '';
  
  if (activeResource.value) {
    fileName = activeResource.value.fileName || '';
  } else {
    fileName = course.value.fileName || '';
  }
  
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
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

// Navigation entre les ressources
const allResources = computed(() => {
  const resources = [];
  
  // Ajouter la ressource principale si elle existe
  if (course.value.resourceType && course.value.resourceUrl) {
    resources.push({ id: null, order: -1 });
  }
  
  // Ajouter les ressources supplémentaires
  if (course.value.resources) {
    resources.push(...course.value.resources.map(r => ({ id: r.id, order: r.order })));
  }
  
  // Trier par ordre
  return resources.sort((a, b) => a.order - b.order);
});

const currentResourceIndex = computed(() => {
  return allResources.value.findIndex(r => r.id === selectedResourceId.value);
});

const hasPreviousResource = computed(() => {
  return currentResourceIndex.value > 0;
});

const hasNextResource = computed(() => {
  return currentResourceIndex.value < allResources.value.length - 1 && currentResourceIndex.value !== -1;
});

const navigateToPreviousResource = () => {
  if (hasPreviousResource.value) {
    const previousResource = allResources.value[currentResourceIndex.value - 1];
    selectResource(previousResource.id ?? null);
  }
};

const navigateToNextResource = () => {
  if (hasNextResource.value) {
    const nextResource = allResources.value[currentResourceIndex.value + 1];
    selectResource(nextResource.id ?? null);
  }
};

// Sélectionner une ressource
const selectResource = (resourceId: string | null) => {
  selectedResourceId.value = resourceId;
  
  // Réinitialiser les lecteurs
  if (pdfViewer.value) {
    pdfViewer.value.src = resourceUrl.value;
  }
  
  if (videoPlayer.value) {
    videoPlayer.value.src = resourceUrl.value;
  }
};

onMounted(async () => {
  try {
    // Charger les informations du cours
    course.value = await CourseService.getCourseById(courseId);
    
    // Appliquer les protections contre le téléchargement
    setupProtections();
  } catch (err: any) {
    error.value = 'Erreur lors du chargement du cours: ' + err.message;
  } finally {
    loading.value = false;
  }
});

// Observer les changements de la ressource active pour mettre à jour les protections
watch([selectedResourceId, activeResourceType], () => {
  // Réinitialiser et réappliquer les protections lorsque la ressource change
  setTimeout(() => {
    setupProtections();
  }, 500);
});

// Configurer toutes les protections nécessaires
const setupProtections = () => {
  // Protections pour le PDF
  if (activeResourceType.value === 'pdf' && pdfViewer.value) {
    // Désactiver le clic droit sur l'iframe
    pdfViewer.value.oncontextmenu = (e) => e.preventDefault();
    
    // Surveiller l'iframe pour détecter si le PDF est chargé
    pdfViewer.value.onload = () => {
      try {
        // Essayer d'injecter du CSS pour masquer les boutons de téléchargement
        const iframeDocument = pdfViewer.value?.contentDocument;
        if (iframeDocument) {
          const style = iframeDocument.createElement('style');
          style.textContent = `
            #download, #print, .download, .print { 
              display: none !important; 
              visibility: hidden !important;
            }
          `;
          iframeDocument.head.appendChild(style);
        }
      } catch (err) {
        console.error('Impossible d\'injecter des styles dans l\'iframe:', err);
      }
    };
  }
  
  // Protections pour la vidéo
  if (activeResourceType.value === 'video' && videoPlayer.value) {
    videoPlayer.value.oncontextmenu = (e) => e.preventDefault();
  }
  
  // Protections globales
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  document.addEventListener('keydown', (e) => {
    // Ctrl+S, Ctrl+P, Ctrl+C, F12, PrintScreen
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
      e.key === 'F12' ||
      e.key === 'PrintScreen'
    ) {
      e.preventDefault();
      return false;
    }
  });
  
  window.addEventListener('beforeprint', (e) => {
    e.preventDefault();
    return false;
  });
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

.pdf-container {
  position: relative;
}

.pdf-protection-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;  /* Largeur suffisante pour couvrir les boutons de téléchargement */
  height: 40px; /* Hauteur suffisante pour couvrir les boutons de téléchargement */
  background-color: transparent;
  z-index: 1000;
  pointer-events: all;
}
</style> 