<template>
    <admin-layout>
      <div class="p-6">
        <div v-if="loading" class="flex justify-center my-8">
          <div class="spinner"></div>
        </div>
  
        <div v-else-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <template v-else>
          <div class="flex items-center mb-6">
            <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-2xl font-semibold dark:text-white">{{ course.title }}</h1>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <!-- Contenu du cours (PDF intégré ou lecteur vidéo) -->
                <div v-if="course.resourceType === 'pdf'" class="h-[70vh]">
                  <iframe 
                    :src="course.fileUrl" 
                    width="100%" 
                    height="100%" 
                    class="rounded-t-lg"
                    allowfullscreen
                  ></iframe>
                </div>
                <div v-else-if="course.resourceType === 'video'" class="relative pt-[56.25%]">
                  <video 
                    :src="course.fileUrl" 
                    class="absolute top-0 left-0 w-full h-full rounded-t-lg"
                    controls
                  ></video>
                </div>
  
                <div class="p-6">
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
                    <button @click="downloadCourse" class="flex items-center text-brand-500 hover:text-brand-600">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Télécharger
                    </button>
                  </div>
  
                  <h2 class="text-xl font-semibold mb-3 dark:text-white">Description</h2>
                  <p class="text-gray-700 dark:text-gray-300 mb-6">{{ course.description }}</p>
  
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span v-for="tag in course.tags" :key="tag" 
                      class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                      {{ tag }}
                    </span>
                  </div>
  
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 class="text-lg font-medium mb-2 dark:text-white">Accessible à</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="role in course.accessibleTo" :key="role" 
                        class="px-3 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 text-sm rounded-full">
                        {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4 dark:text-white">Actions</h2>
                
                <div class="space-y-3">
                  <button @click="router.push(`/courses/edit/${course.id}`)" 
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                  
                  <button @click="confirmDeleteCourse" 
                    class="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
  
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
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import Modal from '@/components/common/Modal.vue';
  import CourseService from '@/services/CourseService';
  import type { Course } from '@/types/Course';
  
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
  const showDeleteModal = ref(false);
  const deleting = ref(false);
  
  onMounted(async () => {
    try {
      course.value = await CourseService.getCourseById(courseId);
    } catch (err: any) {
      error.value = 'Erreur lors du chargement du cours: ' + err.message;
    } finally {
      loading.value = false;
    }
  });
  
  const downloadCourse = async () => {
    try {
      const blob = await CourseService.downloadCourse(courseId);
      
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien et déclencher le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = course.value.fileName || `cours-${courseId}.${course.value.resourceType}`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Erreur lors du téléchargement du cours: ' + err.message);
    }
  };
  
  const confirmDeleteCourse = () => {
    showDeleteModal.value = true;
  };
  
  const deleteCourse = async () => {
    try {
      deleting.value = true;
      await CourseService.deleteCourse(courseId);
      router.push('/courses');
    } catch (err: any) {
      alert('Erreur lors de la suppression du cours: ' + err.message);
    } finally {
      deleting.value = false;
      showDeleteModal.value = false;
    }
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
  </style>