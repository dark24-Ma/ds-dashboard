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
                    :src="course.resourceUrl" 
                    width="100%" 
                    height="100%" 
                    class="rounded-t-lg"
                    allowfullscreen
                  ></iframe>
                </div>
                <div v-else-if="course.resourceType === 'video'" class="relative pt-[56.25%]">
                  <video 
                    :src="course.resourceUrl" 
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
  
        <!-- Section des ressources du cours -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold dark:text-white">Ressources du cours</h2>
            <button 
              @click="showAddResourceModal = true"
              class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter une ressource
            </button>
          </div>
  
          <!-- Liste des ressources -->
          <div v-if="course.resources && course.resources.length > 0" class="space-y-4">
            <div
              v-for="resource in sortedResources"
              :key="resource.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center">
                <span class="mr-3 bg-gray-200 dark:bg-gray-600 p-2 rounded-full">
                  <svg v-if="resource.resourceType === 'pdf'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="resource.resourceType === 'video'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h3 class="font-medium dark:text-white">{{ resource.title }}</h3>
                  <div class="text-sm text-gray-500 dark:text-gray-400 flex space-x-3">
                    <span>{{ resource.resourceType === 'pdf' ? 'PDF' : 'Vidéo' }}</span>
                    <span>{{ resource.duration }} min</span>
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button 
                  @click="previewResource(resource.id || '')"
                  class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-full"
                  title="Prévisualiser"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  @click="editResource(resource)"
                  class="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-full"
                  title="Modifier"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  @click="confirmDeleteResource(resource.id || '')"
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 rounded-full"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Message si aucune ressource -->
          <div v-else class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-gray-500 dark:text-gray-400">Aucune ressource n'a été ajoutée à ce cours.</p>
            <p class="text-sm mt-2">Cliquez sur "Ajouter une ressource" pour commencer à créer du contenu pour ce cours.</p>
          </div>
        </div>
      </div>
  
      <!-- Modal pour ajouter/éditer une ressource -->
      <Modal v-if="showAddResourceModal" @close="showAddResourceModal = false">
        <template #body>
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">
              {{ editingResource ? 'Modifier la ressource' : 'Ajouter une ressource' }}
            </h2>
            
            <div class="space-y-4">
              <!-- Formulaire de ressource -->
              <div class="grid grid-cols-1 gap-4">
                <!-- Titre de la ressource -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre de la ressource *
                  </label>
                  <input 
                    v-model="resourceForm.title" 
                    type="text" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Entrez le titre de la ressource"
                  />
                </div>
    
                <!-- Type de ressource -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de ressource *
                  </label>
                  <select 
                    v-model="resourceForm.resourceType" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>
    
                <!-- Durée -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Durée (en minutes) *
                  </label>
                  <input 
                    v-model.number="resourceForm.duration" 
                    type="number" 
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Durée en minutes"
                  />
                </div>
    
                <!-- Fichier -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fichier {{ editingResource ? '(laisser vide pour conserver l\'actuel)' : '*' }}
                  </label>
                  <input 
                    type="file" 
                    ref="fileInput"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    :accept="resourceForm.resourceType === 'pdf' ? '.pdf' : 'video/*'"
                    @change="handleFileChange"
                  />
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="showAddResourceModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button 
                @click="saveResource" 
                :disabled="saving || !isResourceFormValid"
                :class="[
                  'px-4 py-2 rounded-md text-white',
                  isResourceFormValid 
                    ? 'bg-brand-500 hover:bg-brand-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                ]"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
  
      <!-- Modal de confirmation pour la suppression -->
      <Modal v-if="showDeleteResourceModal" @close="showDeleteResourceModal = false">
        <template #body>
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer la suppression</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                @click="showDeleteResourceModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
              >
                Annuler
              </button>
              <button 
                @click="deleteResource" 
                :disabled="deleting" 
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {{ deleting ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
  
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
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, reactive, computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import Modal from '@/components/common/Modal.vue';
  import CourseService from '@/services/CourseService';
  import type { Course, CourseResource } from '@/types/Course';
  
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
  const showDeleteModal = ref(false);
  const deleting = ref(false);
  
  // État pour les ressources
  const showAddResourceModal = ref(false);
  const showDeleteResourceModal = ref(false);
  const editingResource = ref<CourseResource | null>(null);
  const resourceToDeleteId = ref<string | null>(null);
  const saving = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const selectedFile = ref<File | null>(null);
  
  const resourceForm = reactive({
    title: '',
    resourceType: 'pdf' as 'pdf' | 'video',
    duration: 0,
    order: 0
  });
  
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
  
  // Trier les ressources par ordre
  const sortedResources = computed(() => {
    if (!course.value.resources) return [];
    return [...course.value.resources].sort((a, b) => a.order - b.order);
  });
  
  // Vérifier si le formulaire de ressource est valide
  const isResourceFormValid = computed(() => {
    return (
      resourceForm.title.trim() !== '' && 
      resourceForm.duration > 0 && 
      (editingResource.value || selectedFile.value)
    );
  });
  
  // Réinitialiser le formulaire de ressource
  const resetResourceForm = () => {
    resourceForm.title = '';
    resourceForm.resourceType = 'pdf';
    resourceForm.duration = 0;
    resourceForm.order = course.value.resources ? course.value.resources.length : 0;
    editingResource.value = null;
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  // Gérer le changement de fichier
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile.value = input.files[0];
    } else {
      selectedFile.value = null;
    }
  };
  
  // Ouvrir le modal d'édition de ressource
  const editResource = (resource: CourseResource) => {
    editingResource.value = resource;
    resourceForm.title = resource.title;
    resourceForm.resourceType = resource.resourceType as 'pdf' | 'video';
    resourceForm.duration = resource.duration;
    resourceForm.order = resource.order;
    showAddResourceModal.value = true;
  };
  
  // Prévisualiser une ressource
  const previewResource = (resourceId: string) => {
    router.push(`/courses/${course.value.id}/view?resourceId=${resourceId}`);
  };
  
  // Confirmer la suppression d'une ressource
  const confirmDeleteResource = (resourceId: string) => {
    resourceToDeleteId.value = resourceId;
    showDeleteResourceModal.value = true;
  };
  
  // Supprimer une ressource
  const deleteResource = async () => {
    if (!resourceToDeleteId.value || !course.value.id) return;
    
    try {
      deleting.value = true;
      await CourseService.removeResourceFromCourse(course.value.id, resourceToDeleteId.value);
      
      // Recharger le cours
      course.value = await CourseService.getCourseById(course.value.id);
      
      // Fermer le modal
      showDeleteResourceModal.value = false;
      resourceToDeleteId.value = null;
      
      // Notification de succès
      alert('La ressource a été supprimée avec succès');
    } catch (error: any) {
      alert(`Erreur lors de la suppression de la ressource: ${error.message}`);
    } finally {
      deleting.value = false;
    }
  };
  
  // Enregistrer une ressource
  const saveResource = async () => {
    if (!course.value.id) return;
    
    try {
      saving.value = true;
      
      // Créer un FormData pour l'envoi
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('resourceType', resourceForm.resourceType);
      formData.append('duration', resourceForm.duration.toString());
      formData.append('order', resourceForm.order.toString());
      
      if (selectedFile.value) {
        formData.append('file', selectedFile.value);
      }
      
      if (editingResource.value) {
        // Mettre à jour une ressource existante
        // Note: Cette fonctionnalité nécessite un endpoint API approprié
        // À implémenter selon les besoins
        alert('La modification de ressources existantes n\'est pas encore implémentée');
      } else {
        // Ajouter une nouvelle ressource
        await CourseService.addResourceToCourse(course.value.id, formData);
      }
      
      // Recharger le cours
      course.value = await CourseService.getCourseById(course.value.id);
      
      // Réinitialiser le formulaire et fermer le modal
      resetResourceForm();
      showAddResourceModal.value = false;
      
      // Notification de succès
      alert('La ressource a été enregistrée avec succès');
    } catch (error: any) {
      alert(`Erreur lors de l'enregistrement de la ressource: ${error.message}`);
    } finally {
      saving.value = false;
    }
  };
  
  // Réinitialiser le formulaire lors de l'ouverture du modal
  watch(showAddResourceModal, (newVal) => {
    if (newVal && !editingResource.value) {
      resetResourceForm();
    }
  });
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