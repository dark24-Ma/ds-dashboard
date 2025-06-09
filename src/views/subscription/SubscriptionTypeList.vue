<template>
    <admin-layout>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold dark:text-white">Types d'abonnement</h1>
          <router-link to="/subscription-types/create" 
            class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
            Créer un type d'abonnement
          </router-link>
        </div>
  
        <!-- Affichage des erreurs -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <!-- Tableau des types d'abonnement -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durée (jours)</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr v-for="subscriptionType in subscriptionTypes" :key="subscriptionType.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ subscriptionType.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ subscriptionType.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ subscriptionType.price }} FCFA
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ subscriptionType.duration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <router-link :to="`/subscription-types/edit/${subscriptionType.id}`" 
                      class="text-brand-500 hover:text-brand-700 dark:hover:text-brand-400">
                      Modifier
                    </router-link>
                    <button @click="confirmDelete(subscriptionType.id)" 
                      class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!subscriptionTypes.length">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucun type d'abonnement trouvé
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Modal de confirmation de suppression -->
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer la suppression</h2>
            <p class="mb-6 text-gray-700 dark:text-gray-300">
              Êtes-vous sûr de vouloir supprimer ce type d'abonnement ? Cette action est irréversible.
            </p>
            <div class="flex justify-end space-x-3">
              <button @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                Annuler
              </button>
              <button @click="deleteSubscriptionType"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import SubscriptionService from '@/services/SubscriptionService';
  import type { SubscriptionType } from '@/types/Subscription';
  
  const router = useRouter();
  const subscriptionTypes = ref<SubscriptionType[]>([]);
  const error = ref('');
  const showDeleteModal = ref(false);
  const subscriptionTypeToDelete = ref<string | null>(null);
  
  onMounted(async () => {
    await fetchSubscriptionTypes();
  });
  
  const fetchSubscriptionTypes = async () => {
    try {
      subscriptionTypes.value = await SubscriptionService.getSubscriptionTypes();
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des types d\'abonnement: ' + err.message;
    }
  };
  
  const confirmDelete = (id: string) => {
    subscriptionTypeToDelete.value = id;
    showDeleteModal.value = true;
  };
  
  const deleteSubscriptionType = async () => {
    if (!subscriptionTypeToDelete.value) return;
    
    try {
      await SubscriptionService.deleteSubscriptionType(subscriptionTypeToDelete.value);
      await fetchSubscriptionTypes();
      showDeleteModal.value = false;
    } catch (err: any) {
      error.value = 'Erreur lors de la suppression du type d\'abonnement: ' + err.message;
    }
  };
  </script>