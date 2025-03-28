<template>
    <admin-layout>
      <div class="p-6">
        <div class="flex items-center mb-6">
          <button @click="router.back()"
            class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-semibold dark:text-white">
            {{ isEditing ? 'Modifier le type d\'abonnement' : 'Créer un nouveau type d\'abonnement' }}
          </h1>
        </div>
  
        <!-- Affichage des erreurs -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <!-- Formulaire -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="saveSubscriptionType">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Nom *
              </label>
              <input v-model="subscriptionType.name" type="text" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Description *
              </label>
              <textarea v-model="subscriptionType.description" rows="3" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Prix (€) *
                </label>
                <input v-model.number="subscriptionType.price" type="number" step="0.01" min="0" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Durée (jours) *
                </label>
                <input v-model.number="subscriptionType.duration" type="number" min="1" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Fonctionnalités
              </label>
              <div class="flex items-center mb-2">
                <input v-model="newFeature" type="text" placeholder="Ajouter une fonctionnalité"
                  class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button type="button" @click="addFeature"
                  class="ml-2 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                  Ajouter
                </button>
              </div>
              <div v-if="subscriptionType.features && subscriptionType.features.length > 0" class="mt-3">
                <div v-for="(feature, index) in subscriptionType.features" :key="index"
                  class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-2">
                  <span class="text-gray-800 dark:text-gray-200">{{ feature }}</span>
                  <button type="button" @click="removeFeature(index)"
                    class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            <div class="flex justify-end space-x-3">
              <button type="button" @click="router.back()"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                Annuler
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import SubscriptionService from '@/services/SubscriptionService';
  import type { SubscriptionType } from '@/types/Subscription';
  
  const router = useRouter();
  const route = useRoute();
  
  const subscriptionType = reactive<SubscriptionType>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    features: []
  });
  
  const error = ref('');
  const saving = ref(false);
  const newFeature = ref('');
  const isEditing = computed(() => !!route.params.id);
  
  onMounted(async () => {
    if (isEditing.value) {
      try {
        const subscriptionTypeId = route.params.id as string;
        const data = await SubscriptionService.getSubscriptionTypeById(subscriptionTypeId);
        Object.assign(subscriptionType, data);
      } catch (err: any) {
        error.value = 'Erreur lors du chargement du type d\'abonnement: ' + err.message;
      }
    }
  });
  
  const addFeature = () => {
    if (newFeature.value.trim()) {
      if (!subscriptionType.features) {
        subscriptionType.features = [];
      }
      subscriptionType.features.push(newFeature.value.trim());
      newFeature.value = '';
    }
  };
  
  const removeFeature = (index: number) => {
    if (subscriptionType.features) {
      subscriptionType.features.splice(index, 1);
    }
  };
  
  const saveSubscriptionType = async () => {
    try {
      saving.value = true;
      error.value = '';
  
      if (isEditing.value) {
        await SubscriptionService.updateSubscriptionType(route.params.id as string, subscriptionType);
      } else {
        await SubscriptionService.createSubscriptionType(subscriptionType);
      }
  
      router.push('/subscription-types');
    } catch (err: any) {
      error.value = 'Erreur lors de l\'enregistrement du type d\'abonnement: ' + err.message;
    } finally {
      saving.value = false;
    }
  };
  </script>