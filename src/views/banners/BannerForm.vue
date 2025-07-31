<template>
  <admin-layout>
    <div class="p-6">
      <div class="flex items-center mb-6">
        <button @click="$router.go(-1)" 
          class="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-semibold dark:text-white">
          {{ isEditing ? 'Modifier la bannière' : 'Créer une nouvelle bannière' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="max-w-4xl">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          
          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Titre de la bannière *
            </label>
            <input 
              v-model="formData.title" 
              type="text" 
              required
              placeholder="Titre accrocheur pour votre bannière"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Description
            </label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              placeholder="Description ou texte de présentation de la bannière"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Image de la bannière *
            </label>
            
            <!-- Zone de drag & drop ou sélection de fichier -->
            <div 
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-brand-500 transition-colors"
            >
              <div v-if="!imagePreview">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-brand-500 hover:text-brand-600 cursor-pointer">
                    Cliquez pour sélectionner
                  </span>
                  ou glissez-déposez une image ici
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
              
              <!-- Prévisualisation de l'image -->
              <div v-else class="relative">
                <img :src="imagePreview" alt="Prévisualisation" class="max-h-64 mx-auto rounded-lg" />
                <button 
                  type="button"
                  @click="removeImage"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
            </div>
            
            <button 
              type="button"
              @click="$refs.fileInput.click()"
              class="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Choisir un fichier
            </button>
          </div>

          <!-- Configuration -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Lien de destination -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Lien de destination
              </label>
              <input 
                v-model="formData.linkUrl" 
                type="url" 
                placeholder="https://exemple.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <!-- Audience cible -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Audience cible *
              </label>
              <select 
                v-model="formData.targetAudience" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Sélectionner</option>
                <option value="all">Tous les utilisateurs</option>
                <option value="clients">Clients uniquement</option>
                <option value="subscribers">Abonnés uniquement</option>
              </select>
            </div>

            <!-- Ordre d'affichage -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Ordre d'affichage *
              </label>
              <input 
                v-model.number="formData.displayOrder" 
                type="number" 
                min="1"
                required
                placeholder="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <!-- Statut -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Statut
              </label>
              <div class="flex items-center space-x-3">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="formData.isActive" 
                    :value="true"
                    class="text-brand-500 focus:ring-brand-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Actif</span>
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="formData.isActive" 
                    :value="false"
                    class="text-brand-500 focus:ring-brand-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Inactif</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button"
              @click="$router.go(-1)"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button 
              type="submit"
              :disabled="submitting || !formData.title"
              class="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
            >
              {{ submitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BannerService from '@/services/BannerService';

const route = useRoute();
const router = useRouter();

const isEditing = ref(false);
const submitting = ref(false);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string>('');
const fileInput = ref<HTMLInputElement>();

const formData = reactive({
  title: '',
  description: '',
  linkUrl: '',
  targetAudience: 'all' as 'all' | 'clients' | 'subscribers',
  displayOrder: 1,
  isActive: true
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeImage = () => {
  selectedFile.value = null;
  imagePreview.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const loadBanner = async (bannerId: string) => {
  try {
    const banner = await BannerService.getBannerById(bannerId);
    formData.title = banner.title;
    formData.description = banner.description || '';
    formData.linkUrl = banner.linkUrl || '';
    formData.targetAudience = banner.targetAudience || 'all';
    formData.displayOrder = banner.displayOrder;
    formData.isActive = banner.isActive;
    
    // Afficher l'image existante
    if (banner.imageUrl) {
      imagePreview.value = BannerService.getImageUrl(banner.imageUrl);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la bannière:', error);
    router.push('/banners');
  }
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('linkUrl', formData.linkUrl);
    formDataToSend.append('targetAudience', formData.targetAudience);
    formDataToSend.append('displayOrder', formData.displayOrder.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    
    if (selectedFile.value) {
      formDataToSend.append('image', selectedFile.value);
    }
    
    if (isEditing.value) {
      await BannerService.updateBanner(route.params.id as string, formDataToSend);
    } else {
      await BannerService.createBanner(formDataToSend);
    }
    
    router.push('/banners');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true;
    loadBanner(route.params.id as string);
  }
});
</script>

<style scoped>
input[type="file"] {
  display: none;
}
</style> 