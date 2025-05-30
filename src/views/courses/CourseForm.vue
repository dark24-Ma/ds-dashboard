<template>
    <admin-layout>
      <div class="p-6">
        <div class="flex items-center mb-6">
          <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-semibold dark:text-white">
            {{ isEditing ? 'Modifier le cours' : 'Ajouter un nouveau cours' }}
          </h1>
        </div>
  
        <!-- Affichage des erreurs -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <!-- Formulaire -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="saveCourse">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Titre *
                </label>
                <input 
                  v-model="formData.title" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Type de ressource *
                </label>
                <select 
                  v-model="formData.resourceType" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
  
              <div class="lg:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Description *
                </label>
                <textarea 
                  v-model="formData.description" 
                  rows="4" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Durée (minutes) *
                </label>
                <input 
                  v-model.number="formData.duration" 
                  type="number" 
                  min="1"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Accessible à *
                </label>
                <div class="space-y-2">
                  <div v-for="role in availableRoles" :key="role" class="flex items-center">
                    <input 
                      :id="`role-${role}`"
                      type="checkbox"
                      :value="role"
                      v-model="formData.accessibleTo"
                      class="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded"
                    />
                    <label :for="`role-${role}`" class="ml-2 text-sm text-gray-700 dark:text-gray-400">
                      {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                    </label>
                  </div>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Accès libre
                </label>
                <div class="flex items-center">
                  <input 
                    id="free-access"
                    type="checkbox"
                    v-model="formData.isFreeAccess"
                    class="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded"
                  />
                  <label for="free-access" class="ml-2 text-sm text-gray-700 dark:text-gray-400">
                    Accessible sans abonnement
                  </label>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Si activé, ce cours sera accessible à tous les utilisateurs, même sans abonnement.
                </p>
              </div>
  
              <div class="lg:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Tags
                </label>
                <div class="relative">
                  <input 
                    v-model="tagInput" 
                    type="text" 
                    placeholder="Entrez un tag et appuyez sur Entrée"
                    @keydown.enter.prevent="addNewTag"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div class="flex flex-wrap mt-2 gap-2">
                  <span 
                    v-for="tag in formData.tags" 
                    :key="tag" 
                    class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs flex items-center">
                    {{ tag }}
                    <button type="button" @click="removeTag(tag)" class="ml-1 text-gray-600 dark:text-gray-400">×</button>
                  </span>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Fichier {{ isEditing ? '(laisser vide pour conserver l\'actuel)' : '*' }}
                </label>
                <input 
                  type="file"
                  ref="fileInput"
                  :required="!isEditing"
                  @change="handleFileChange"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  :accept="formData.resourceType === 'pdf' ? '.pdf' : 'video/*'"
                />
                <p v-if="isEditing && course.fileName" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Fichier actuel: {{ course.fileName }}
                </p>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Miniature {{ isEditing ? '(laisser vide pour conserver l\'actuelle)' : '*' }}
                </label>
                <input 
                  type="file"
                  ref="thumbnailInput"
                  :required="!isEditing"
                  @change="handleThumbnailChange"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  accept="image/*"
                />
                <div v-if="thumbnailPreview || (isEditing && course.thumbnailUrl)" class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Aperçu:</p>
                  <img 
                    :src="thumbnailPreview || course.thumbnailUrl" 
                    alt="Aperçu de la miniature" 
                    class="h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
  
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="router.back()" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                :disabled="saving" 
                class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import CourseService from '@/services/CourseService';
  import type { Course, CourseResourceType, UserRole } from '@/types/Course';
  
  const router = useRouter();
  const route = useRoute();
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const thumbnailInput = ref<HTMLInputElement | null>(null);
  const thumbnailPreview = ref<string | null>(null);
  const course = ref<Course & { fileName?: string }>({
    title: '',
    description: '',
    resourceType: 'pdf',
    tags: [],
    accessibleTo: ['client'],
    duration: 60
  });
  
  const formData = reactive({
    title: '',
    description: '',
    resourceType: 'pdf' as CourseResourceType,
    tags: [] as string[],
    accessibleTo: ['client'] as UserRole[],
    duration: 60,
    file: null as File | null,
    thumbnail: null as File | null,
    isFreeAccess: false
  });
  
  const availableRoles = ['client', 'admin', 'instructor'] as UserRole[];
  const tagInput = ref('');
  const error = ref('');
  const saving = ref(false);
  const isEditing = computed(() => !!route.params.id);
  
  onMounted(async () => {
    if (isEditing.value) {
      try {
        const courseId = route.params.id as string;
        const data = await CourseService.getCourseById(courseId);
        course.value = data;
      
        // Initialiser le formulaire avec les données du cours
        formData.title = data.title;
        formData.description = data.description;
        formData.resourceType = data.resourceType;
        formData.tags = [...data.tags];
        formData.accessibleTo = [...data.accessibleTo];
        formData.duration = data.duration;
        formData.isFreeAccess = data.isFreeAccess || false;
      } catch (err: any) {
        error.value = 'Erreur lors du chargement du cours: ' + err.message;
      }
    }
  });

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      formData.file = file;
      
      // Vérifier que le type de fichier correspond au type de ressource sélectionné
      if (formData.resourceType === 'pdf' && !file.type.includes('pdf')) {
        error.value = 'Veuillez sélectionner un fichier PDF.';
        formData.file = null;
        if (fileInput.value) fileInput.value.value = '';
      } else if (formData.resourceType === 'video' && !file.type.includes('video')) {
        error.value = 'Veuillez sélectionner un fichier vidéo.';
        formData.file = null;
        if (fileInput.value) fileInput.value.value = '';
      } else {
        error.value = '';
      }
    }
  };

  const handleThumbnailChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      formData.thumbnail = file;
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        thumbnailPreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTag = () => {
    const tag = tagInput.value.trim();
    if (tag && !formData.tags.includes(tag)) {
      formData.tags.push(tag);
      tagInput.value = '';
    }
  };

  const removeTag = (tag: string) => {
    formData.tags = formData.tags.filter(t => t !== tag);
  };

  const saveCourse = async () => {
    // Vérifier la validité du formulaire
    if (!formData.title || !formData.description || !formData.accessibleTo.length) {
      error.value = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    
    if (!isEditing.value && !formData.file) {
      error.value = 'Veuillez sélectionner un fichier.';
      return;
    }
    
    if (!isEditing.value && !formData.thumbnail) {
      error.value = 'Veuillez sélectionner une miniature.';
      return;
    }
    
    try {
      saving.value = true;
      error.value = '';
      
      // Créer un objet FormData pour envoyer les fichiers
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('resourceType', formData.resourceType);
      data.append('duration', formData.duration.toString());
      data.append('isFreeAccess', formData.isFreeAccess.toString());
      
      // Ajouter les tags et les rôles
      formData.tags.forEach(tag => {
        data.append('tags[]', tag);
      });
      
      formData.accessibleTo.forEach(role => {
        data.append('accessibleTo[]', role);
      });
      
      // Ajouter les fichiers s'ils sont présents
      if (formData.file) {
        data.append('file', formData.file);
      }
      
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }
      
      if (isEditing.value) {
        await CourseService.updateCourse(route.params.id as string, data);
      } else {
        await CourseService.createCourse(data);
      }
      
      router.push('/courses');
    } catch (err: any) {
      error.value = 'Erreur lors de l\'enregistrement du cours: ' + err.message;
    } finally {
      saving.value = false;
    }
  };
</script>

<style scoped>
/* Styles pour l'input file */
input[type="file"] {
  cursor: pointer;
}

input[type="file"]::file-selector-button {
  border: none;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.dark input[type="file"]::file-selector-button {
  background-color: #4b5563;
  color: #e5e7eb;
}
</style>