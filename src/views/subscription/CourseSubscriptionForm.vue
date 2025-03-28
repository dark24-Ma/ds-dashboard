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
            Gérer les accès au cours
          </h1>
        </div>
  
        <!-- Affichage des erreurs -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
  
        <!-- Formulaire -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="saveCourseAccess">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Cours *
              </label>
              <select v-model="courseAccess.courseId" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="" disabled>Sélectionnez un cours</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.title }}
                </option>
              </select>
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Type d'accès
              </label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input id="free" type="radio" v-model="courseAccess.accessType" value="free" 
                    class="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                  <label for="free" class="ml-2 block text-sm text-gray-700 dark:text-gray-400">
                    Gratuit (accessible à tous)
                  </label>
                </div>
                <div class="flex items-center">
                  <input id="premium" type="radio" v-model="courseAccess.accessType" value="premium" 
                    class="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                  <label for="premium" class="ml-2 block text-sm text-gray-700 dark:text-gray-400">
                    Premium (nécessite un abonnement)
                  </label>
                </div>
              </div>
            </div>
  
            <div v-if="courseAccess.accessType === 'premium'" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Types d'abonnement requis
              </label>
              <div class="mt-2 space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div v-for="type in subscriptionTypes" :key="type.id" class="flex items-start">
                  <div class="flex items-center h-5">
                    <input :id="'type-' + type.id" type="checkbox" :value="type.id" v-model="courseAccess.requiredSubscriptionTypes"
                      class="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700" />
                  </div>
                  <div class="ml-3 text-sm">
                    <label :for="'type-' + type.id" class="font-medium text-gray-700 dark:text-gray-300">{{ type.name }}</label>
                    <p class="text-gray-500 dark:text-gray-400">{{ type.description }}</p>
                  </div>
                </div>
              </div>
              <p v-if="!subscriptionTypes.length" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Aucun type d'abonnement disponible. Veuillez en créer un d'abord.
              </p>
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
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import SubscriptionService from '@/services/SubscriptionService';
  import CourseService from '@/services/CourseService';
  import type { SubscriptionType } from '@/types/Subscription';
  import type { Course } from '@/types/Course';
  
  const router = useRouter();
  const route = useRoute();
  
  const courseAccess = reactive({
    courseId: '',
    accessType: 'free',
    requiredSubscriptionTypes: [] as string[]
  });
  
  const courses = ref<Course[]>([]);
  const subscriptionTypes = ref<SubscriptionType[]>([]);
  const error = ref('');
  const saving = ref(false);
  
  onMounted(async () => {
    try {
      // Charger les cours et les types d'abonnement
      const [coursesData, typesData] = await Promise.all([
        CourseService.getCourses(),
        SubscriptionService.getSubscriptionTypes()
      ]);
      
      courses.value = coursesData;
      subscriptionTypes.value = typesData;
      
      // Si un ID de cours est fourni dans l'URL, charger les informations d'accès
      if (route.params.courseId) {
        courseAccess.courseId = route.params.courseId as string;
        await loadCourseAccess();
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des données: ' + err.message;
    }
  });
  
  // Réinitialiser les types d'abonnement requis lorsque le type d'accès change
  watch(() => courseAccess.accessType, (newValue) => {
    if (newValue === 'free') {
      courseAccess.requiredSubscriptionTypes = [];
    }
  });
  
  const loadCourseAccess = async () => {
    try {
      const accessData = await CourseService.getCourseAccess(courseAccess.courseId);
      courseAccess.accessType = accessData.accessType;
      courseAccess.requiredSubscriptionTypes = accessData.requiredSubscriptionTypes || [];
    } catch (err: any) {
      // Si l'accès n'est pas défini, utiliser les valeurs par défaut
      courseAccess.accessType = 'free';
      courseAccess.requiredSubscriptionTypes = [];
    }
  };
  
  const saveCourseAccess = async () => {
    try {
      saving.value = true;
      error.value = '';
  
      await CourseService.updateCourseAccess(courseAccess.courseId, {
        accessType: courseAccess.accessType,
        requiredSubscriptionTypes: courseAccess.accessType === 'premium' 
          ? courseAccess.requiredSubscriptionTypes 
          : []
      });
  
      router.push('/courses');
    } catch (err: any) {
      error.value = 'Erreur lors de l\'enregistrement des accès: ' + err.message;
    } finally {
      saving.value = false;
    }
  };
  </script>