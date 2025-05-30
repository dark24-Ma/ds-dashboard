<template>
    <admin-layout>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold dark:text-white">Gestion des Cours</h1>
          <button @click="navigateToCreateCourse" 
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
            Ajouter un cours
          </button>
        </div>
  
        <!-- Filtres -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Tags
              </label>
              <div class="relative">
                <input 
                  v-model="tagInput" 
                  type="text" 
                  placeholder="Sélectionner des tags..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  @focus="showTagDropdown = true"
                  @blur="window.setTimeout(() => { showTagDropdown = false }, 200)"
                />
                <div v-if="showTagDropdown && availableTags.length > 0" 
                  class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 max-h-60 overflow-y-auto">
                  <div v-for="tag in availableTags" :key="tag" 
                    @click="addTag(tag)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    {{ tag }}
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap mt-2 gap-2">
                <span 
                  v-for="tag in filters.tags" 
                  :key="tag" 
                  class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs flex items-center">
                  {{ tag }}
                  <button @click="removeTag(tag)" class="ml-1 text-gray-600 dark:text-gray-400">×</button>
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Liste des cours -->
        <div v-if="loading" class="flex justify-center my-8">
          <div class="spinner"></div>
        </div>
  
        <div v-else-if="courses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p class="text-gray-500 dark:text-gray-400">Aucun cours disponible.</p>
        </div>
  
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
                    class="text-brand-500 hover:text-brand-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <button @click="editCourse(course.id)" 
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button @click="confirmDeleteCourse(course.id)" 
                    class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Modal de confirmation pour la suppression -->
        <Modal v-if="showDeleteModal" @close="showDeleteModal = false">
          <template #body>
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer la suppression</h2>
              <p class="mb-4 text-gray-600 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
              </p>
              <div class="flex justify-end space-x-3">
                <button @click="showDeleteModal = false" 
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                  Annuler
                </button>
                <button @click="deleteCourse" :disabled="deleting" 
                  class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  {{ deleting ? 'Suppression...' : 'Supprimer' }}
                </button>
              </div>
            </div>
          </template>
        </Modal>
      </div>
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import Modal from '@/components/common/Modal.vue';
  import CourseService from '@/services/CourseService';
  import UserService from '@/services/UserService';
  import type { Course, CourseFilter, CourseResourceType } from '@/types/Course';
  
  // Déclaration pour window.searchTimeout
  declare global {
    interface Window {
      searchTimeout: number;
    }
  }
  
  const router = useRouter();
  const courses = ref<Course[]>([]);
  const availableTags = ref<string[]>([]);
  const loading = ref(true);
  const tagInput = ref('');
  const showTagDropdown = ref(false);
  
  const filters = reactive<CourseFilter>({
    search: '',
    resourceType: undefined,
    tags: []
  });
  
  // États pour la suppression
  const showDeleteModal = ref(false);
  const courseIdToDelete = ref<string | null>(null);
  const deleting = ref(false);
  
  // Ajoutez une constante pour l'URL de base de l'API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://185.97.146.99:2403';
  
  // Informations sur l'utilisateur courant
  const currentUser = ref(UserService.getCurrentUser());
  const isAdmin = computed(() => currentUser.value && currentUser.value.userType === 'admin');
  
  onMounted(async () => {
    try {
      await Promise.all([
        loadCourses(),
        loadTags()
      ]);
    } catch (err: any) {
      console.error('Erreur lors du chargement initial:', err.message);
    } finally {
      loading.value = false;
    }
  });
  
  const loadCourses = async () => {
    try {
      courses.value = await CourseService.getCourses(filters);
      
      // Si l'utilisateur n'est pas admin, filtrer les cours pour n'afficher que ceux auxquels il a accès
      if (!isAdmin.value) {
        courses.value = courses.value.filter(course => {
          // Vérifier si le cours est accessible au type d'utilisateur courant
          if (currentUser.value && course.accessibleTo.includes(currentUser.value.userType as any)) {
            return true;
          }
          // Sinon vérifier si le cours est en accès libre
          return course.isFreeAccess;
        });
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des cours:', err.message);
    }
  };
  
  const loadTags = async () => {
    try {
      availableTags.value = await CourseService.getAllTags();
    } catch (err: any) {
      console.error('Erreur lors du chargement des tags:', err.message);
    }
  };
  
  const applyFilters = () => {
    // Debounce pour la recherche
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      loadCourses();
    }, 300);
  };
  
  const addTag = (tag: string) => {
    if (!filters.tags) {
      filters.tags = [];
    }
    
    if (!filters.tags.includes(tag)) {
      filters.tags.push(tag);
      tagInput.value = '';
      applyFilters();
    }
  };
  
  const removeTag = (tag: string) => {
    if (filters.tags) {
      filters.tags = filters.tags.filter(t => t !== tag);
      applyFilters();
    }
  };
  
  const navigateToCreateCourse = () => {
    router.push('/courses/create');
  };
  
  const editCourse = (id: string | undefined) => {
    if (id) {
      router.push(`/courses/edit/${id}`);
    }
  };
  
  const confirmDeleteCourse = (id: string | undefined) => {
    if (id) {
      courseIdToDelete.value = id;
      showDeleteModal.value = true;
    }
  };
  
  const deleteCourse = async () => {
    if (!courseIdToDelete.value) return;
    
    try {
      deleting.value = true;
      
      await CourseService.deleteCourse(courseIdToDelete.value);
      
      // Recharger la liste après suppression
      await loadCourses();
      
      showDeleteModal.value = false;
    } catch (err: any) {
      alert('Erreur lors de la suppression du cours: ' + err.message);
    } finally {
      deleting.value = false;
    }
  };
  
  const viewCourse = (id: string | undefined) => {
    if (!id) return;
    router.push(`/courses/${id}/view`);
  };
  
  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (thumbnailUrl: string | undefined): string => {
    if (!thumbnailUrl) {
      return '/images/default-course.jpg';
    }
    
    // Si l'URL commence déjà par http(s), c'est une URL complète
    if (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) {
      return thumbnailUrl;
    }
    
    // Sinon, on concatène avec l'URL de base de l'API (sans le chemin /api s'il est inclus)
    const baseUrl = API_BASE_URL.endsWith('/api') 
      ? API_BASE_URL.substring(0, API_BASE_URL.length - 4) 
      : API_BASE_URL;
      
    return `${baseUrl}/${thumbnailUrl}`;
  };
  
  // Fonction pour gérer les erreurs de chargement d'image
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = '/images/default-course.jpg';
  };
  </script>
  
  <style scoped>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
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