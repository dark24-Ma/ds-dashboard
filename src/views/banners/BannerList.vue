<template>
  <admin-layout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold dark:text-white">Gestion des Bannières Publicitaires</h1>
        <button @click="navigateToCreateBanner" 
          class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
          Ajouter une bannière
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
              placeholder="Rechercher par titre..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @input="applyFilters"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Statut
            </label>
            <select 
              v-model="filters.isActive" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="applyFilters"
            >
              <option value="">Tous les statuts</option>
              <option :value="true">Actif</option>
              <option :value="false">Inactif</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Audience cible
            </label>
            <select 
              v-model="filters.targetAudience" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="applyFilters"
            >
              <option value="">Toutes les audiences</option>
              <option value="all">Tous les utilisateurs</option>
              <option value="clients">Clients uniquement</option>
              <option value="subscribers">Abonnés uniquement</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Message de chargement -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>

      <!-- Message si aucune bannière -->
      <div v-else-if="banners.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">Aucune bannière trouvée.</p>
      </div>

      <!-- Liste des bannières -->
      <div v-else class="space-y-4">
        <div v-for="banner in banners" :key="banner.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-start space-x-4">
            <!-- Image de la bannière -->
            <div class="flex-shrink-0">
              <img 
                :src="getImageUrl(banner.imageUrl)" 
                :alt="banner.title"
                class="w-32 h-20 object-cover rounded-lg"
                @error="handleImageError"
              />
            </div>
            
            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ banner.title }}
                  </h3>
                  <p v-if="banner.description" class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {{ banner.description }}
                  </p>
                  
                  <!-- Métadonnées -->
                  <div class="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ banner.impressions || 0 }} vues
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      {{ banner.clickCount || 0 }} clics
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {{ getTargetAudienceLabel(banner.targetAudience) }}
                    </span>
                    <span>Ordre: {{ banner.displayOrder }}</span>
                  </div>
                </div>
                
                <!-- Badges et statuts -->
                <div class="flex flex-col items-end space-y-2">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      banner.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    ]"
                  >
                    {{ banner.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                  
                  <!-- Actions -->
                  <div class="flex space-x-2">
                    <button @click="toggleBannerStatus(banner)" 
                      :class="[
                        'p-2 rounded-lg text-sm',
                        banner.isActive 
                          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                          : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      ]"
                      :title="banner.isActive ? 'Désactiver' : 'Activer'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="banner.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    
                    <button @click="editBanner(banner.id)" 
                      class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button @click="confirmDeleteBanner(banner.id)" 
                      class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Lien de destination -->
              <div v-if="banner.linkUrl" class="mt-3">
                <a :href="banner.linkUrl" target="_blank" 
                  class="text-brand-500 hover:text-brand-600 text-sm flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {{ banner.linkUrl }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation pour la suppression -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer la suppression</h2>
          <p class="mb-4 text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer cette bannière ? Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
              Annuler
            </button>
            <button @click="deleteBanner" :disabled="deleting" 
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50">
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BannerService from '@/services/BannerService';
import type { Banner, BannerFilterOptions } from '@/types/Banner';

const router = useRouter();
const banners = ref<Banner[]>([]);
const loading = ref(true);
const showDeleteModal = ref(false);
const bannerToDelete = ref<string | null>(null);
const deleting = ref(false);

const filters = reactive<BannerFilterOptions>({
  isActive: undefined,
  targetAudience: ''
});

// Déclaration pour window.searchTimeout
declare global {
  interface Window {
    searchTimeout: number;
  }
}

const loadBanners = async () => {
  try {
    loading.value = true;
    const response = await BannerService.getBanners(filters);
    banners.value = response.sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error('Erreur lors du chargement des bannières:', error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout);
  }
  
  window.searchTimeout = window.setTimeout(() => {
    loadBanners();
  }, 500);
};

const getImageUrl = (imageUrl: string | undefined) => {
  return BannerService.getImageUrl(imageUrl);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/cards/card-01.png';
};

const getTargetAudienceLabel = (audience?: string) => {
  switch (audience) {
    case 'all': return 'Tous les utilisateurs';
    case 'clients': return 'Clients uniquement';
    case 'subscribers': return 'Abonnés uniquement';
    default: return 'Non défini';
  }
};

const navigateToCreateBanner = () => {
  router.push('/banners/create');
};

const editBanner = (bannerId?: string) => {
  if (bannerId) {
    router.push(`/banners/edit/${bannerId}`);
  }
};

const toggleBannerStatus = async (banner: Banner) => {
  if (!banner.id) return;
  
  try {
    await BannerService.toggleBannerStatus(banner.id);
    banner.isActive = !banner.isActive;
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
  }
};

const confirmDeleteBanner = (bannerId?: string) => {
  if (bannerId) {
    bannerToDelete.value = bannerId;
    showDeleteModal.value = true;
  }
};

const deleteBanner = async () => {
  if (!bannerToDelete.value) return;
  
  try {
    deleting.value = true;
    await BannerService.deleteBanner(bannerToDelete.value);
    banners.value = banners.value.filter(banner => banner.id !== bannerToDelete.value);
    showDeleteModal.value = false;
    bannerToDelete.value = null;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadBanners();
});
</script> 