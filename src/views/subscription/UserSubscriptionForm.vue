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
            Attribuer un abonnement
          </h1>
        </div>
  
        <!-- Affichage des erreurs -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <!-- Formulaire -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="subscribeUser">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Utilisateur *
              </label>
              <select v-model="subscription.userId" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="" disabled>Sélectionnez un utilisateur</option>
                <option v-for="user in users" :key="user.id" :value="user._id">
                  {{ user.firstname }} {{ user.name }} ({{ user.email }})
                </option>
              </select>
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Type d'abonnement *
              </label>
              <select v-model="subscription.subscriptionTypeId" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="" disabled>Sélectionnez un type d'abonnement</option>
                <option v-for="type in subscriptionTypes" :key="type.id" :value="type.id">
                  {{ type.name }} - {{ type.price }} FCFA / {{ type.duration }} jours
                </option>
              </select>
            </div>
  
            <div v-if="selectedSubscriptionType" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">Détails de l'abonnement</h3>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedSubscriptionType.description }}</p>
              <div class="mt-3">
                <p class="text-gray-700 dark:text-gray-300 font-medium">Fonctionnalités :</p>
                <ul class="mt-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li v-for="(feature, index) in selectedSubscriptionType.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
  
            <div class="flex justify-end space-x-3">
              <button type="button" @click="router.back()"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                Annuler
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                {{ saving ? 'Attribution...' : 'Attribuer l\'abonnement' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </admin-layout>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import SubscriptionService from '@/services/SubscriptionService';
  import UserService from '@/services/UserService';
  import type { SubscriptionType } from '@/types/Subscription';
  import type { User } from '@/types/User';
  
  const router = useRouter();
  
  const subscription = reactive({
    userId: '',
    subscriptionTypeId: ''
  });
  
  const users = ref<User[]>([]);
  const subscriptionTypes = ref<SubscriptionType[]>([]);
  const error = ref('');
  const saving = ref(false);
  
  const selectedSubscriptionType = computed(() => {
    if (!subscription.subscriptionTypeId) return null;
    return subscriptionTypes.value.find(type => type.id === subscription.subscriptionTypeId);
  });
  
  onMounted(async () => {
    try {
      // Charger les utilisateurs et les types d'abonnement
      const [usersData, typesData] = await Promise.all([
        UserService.getUsers(),
        SubscriptionService.getSubscriptionTypes()
      ]);
      
      users.value = usersData;
      subscriptionTypes.value = typesData;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des données: ' + err.message;
    }
  });
  
  const subscribeUser = async () => {
    try {
      saving.value = true;
      error.value = '';
  
      // Vérification que les champs requis sont remplis
      if (!subscription.userId) {
        error.value = 'Veuillez sélectionner un utilisateur';
        saving.value = false;
        return;
      }
  
      if (!subscription.subscriptionTypeId) {
        error.value = 'Veuillez sélectionner un type d\'abonnement';
        saving.value = false;
        return;
      }
  
      // S'assurer que les données sont bien au format attendu par l'API
      const subscriptionData = {
        userId: subscription.userId,
        subscriptionTypeId: subscription.subscriptionTypeId
      };
  
      // Appel à l'API avec les données vérifiées
      await SubscriptionService.subscribeUser(subscriptionData);
      router.push('/user-subscriptions');
    } catch (err: any) {
      console.error('Erreur détaillée:', err);
      error.value = 'Erreur lors de l\'attribution de l\'abonnement: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue');
    } finally {
      saving.value = false;
    }
  };
  </script>