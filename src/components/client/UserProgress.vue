<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Votre Progression</h3>
    <div class="flex items-center justify-center min-h-[200px]">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-800 dark:text-white/90 mb-2">Progression d'apprentissage</h4>
        <p class="text-gray-600 dark:text-gray-400 text-sm">3 cours terminés sur 25 disponibles</p>
        <div class="w-full bg-gray-200 rounded-full h-3 mt-4 dark:bg-gray-700">
          <div class="bg-blue-500 h-3 rounded-full" style="width: 12%"></div>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">12% complété</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant de progression utilisateur
</script> 