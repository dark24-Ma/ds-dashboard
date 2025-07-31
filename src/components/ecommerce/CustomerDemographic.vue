<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
  >
    <div class="flex justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Démographie des Clients
        </h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Distribution des types d'utilisateurs et statuts d'abonnement
        </p>
      </div>
    </div>
    <div class="space-y-6">
      <!-- Types d'utilisateurs -->
      <div>
        <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Types d'utilisateurs</h4>
        <div class="space-y-4">
          <div 
            v-for="userType in demographicData.userTypes" 
            :key="userType.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="h-3 w-3 rounded-full bg-blue-500"></div>
              <div>
                <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{ userType.name }}</p>
                <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {{ userType.value }} utilisateurs
                </span>
              </div>
            </div>

            <div class="flex w-full max-w-[140px] items-center gap-3">
              <div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  class="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white"
                  :style="{ width: `${getPercentage(userType.value, totalUserTypes)}%` }"
                ></div>
              </div>
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {{ getPercentage(userType.value, totalUserTypes) }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statuts d'abonnement -->
      <div>
        <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Statuts d'abonnement</h4>
        <div class="space-y-4">
          <div 
            v-for="status in demographicData.subscriptionStatus" 
            :key="status.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div 
                class="h-3 w-3 rounded-full"
                :class="status.name === 'Actif' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <div>
                <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{ status.name }}</p>
                <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {{ status.value }} abonnements
                </span>
              </div>
            </div>

            <div class="flex w-full max-w-[140px] items-center gap-3">
              <div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  class="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm text-xs font-medium text-white"
                  :class="status.name === 'Actif' ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: `${getPercentage(status.value, totalSubscriptionStatus)}%` }"
                ></div>
              </div>
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {{ getPercentage(status.value, totalSubscriptionStatus) }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import DashboardStatisticsService, { type DemographicData } from '../../services/DashboardStatisticsService'

const demographicData = ref<DemographicData>({
  userTypes: [],
  subscriptionStatus: []
})

const totalUserTypes = computed(() => 
  demographicData.value.userTypes.reduce((sum, type) => sum + type.value, 0)
)

const totalSubscriptionStatus = computed(() => 
  demographicData.value.subscriptionStatus.reduce((sum, status) => sum + status.value, 0)
)

const getPercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

const loadDemographicData = async () => {
  try {
    demographicData.value = await DashboardStatisticsService.getCustomerDemographicData()
  } catch (error) {
    console.error('Erreur lors du chargement des données démographiques:', error)
  }
}

onMounted(() => {
  loadDemographicData()
})
</script>
