<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">🚀 Débloquez votre potentiel</h3>
    <div class="flex items-center justify-center min-h-[200px]">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-800 dark:text-white/90 mb-2">Passez au Premium</h4>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Accès illimité à tous les cours + certificats</p>
        
        <!-- Comparaison rapide -->
        <div class="grid grid-cols-1 gap-3 mb-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gratuit</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">5 cours • Pas de certificats</div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg p-3">
            <div class="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Premium - 29€/mois</div>
            <div class="text-xs text-purple-600 dark:text-purple-400">Tous les cours • Certificats • Support</div>
          </div>
        </div>
        
        <button class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 mb-2">
          Voir les abonnements
        </button>
        
        <p class="text-xs text-gray-500 dark:text-gray-400">
          🔥 Offre spéciale : 50% de réduction ce mois-ci
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant d'upsell pour les abonnements
</script> 