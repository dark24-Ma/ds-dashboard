<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <!-- Loading State -->
        <div v-if="isChecking" class="space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-500 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            Vérification du paiement...
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Veuillez patienter pendant que nous vérifions votre paiement.
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="paymentStatus === 'success'" class="space-y-4">
          <div class="rounded-full h-16 w-16 bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
            <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-green-600 dark:text-green-400">
            Paiement réussi !
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de votre nouveau plan.
          </p>
          <button @click="goToProfile" 
            class="w-full bg-brand-500 text-white py-3 px-4 rounded-lg hover:bg-brand-600 transition-colors">
            Voir mon profil
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="paymentStatus === 'failed'" class="space-y-4">
          <div class="rounded-full h-16 w-16 bg-red-100 dark:bg-red-900 mx-auto flex items-center justify-center">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
            Échec du paiement
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Le paiement n'a pas pu être traité. {{ errorMessage || 'Veuillez réessayer.' }}
          </p>
          <div class="space-y-2">
            <button @click="retryPayment" 
              class="w-full bg-brand-500 text-white py-3 px-4 rounded-lg hover:bg-brand-600 transition-colors">
              Réessayer le paiement
            </button>
            <button @click="goToProfile" 
              class="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Retour au profil
            </button>
          </div>
        </div>

        <!-- Pending State -->
        <div v-else-if="paymentStatus === 'pending'" class="space-y-4">
          <div class="rounded-full h-16 w-16 bg-yellow-100 dark:bg-yellow-900 mx-auto flex items-center justify-center">
            <svg class="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
            Paiement en cours
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Votre paiement est en cours de traitement. Nous vous informerons dès qu'il sera confirmé.
          </p>
          <div class="space-y-2">
            <button @click="checkPaymentStatus" 
              class="w-full bg-brand-500 text-white py-3 px-4 rounded-lg hover:bg-brand-600 transition-colors">
              Vérifier à nouveau
            </button>
            <button @click="goToProfile" 
              class="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Retour au profil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PaymentService from '@/services/PaymentService'

const router = useRouter()

const isChecking = ref(true)
const paymentStatus = ref<'success' | 'failed' | 'pending' | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  await checkPaymentStatus()
})

const checkPaymentStatus = async () => {
  try {
    isChecking.value = true
    
    // Récupérer l'identifier de paiement sauvegardé
    const identifier = PaymentService.getCurrentPaymentIdentifier()
    
    if (!identifier) {
      paymentStatus.value = 'failed'
      errorMessage.value = 'Aucune transaction en cours trouvée.'
      return
    }

    // Vérifier le statut auprès de l'API
    const statusResponse = await PaymentService.checkPaymentStatus(identifier)
    
    switch (statusResponse.status) {
      case 'success':
        paymentStatus.value = 'success'
        // Nettoyer l'identifier de paiement
        PaymentService.clearPaymentIdentifier()
        break
      case 'pending':
        paymentStatus.value = 'pending'
        break
      case 'expired':
      case 'cancelled':
        paymentStatus.value = 'failed'
        errorMessage.value = `Paiement ${statusResponse.status === 'expired' ? 'expiré' : 'annulé'}.`
        PaymentService.clearPaymentIdentifier()
        break
      default:
        paymentStatus.value = 'failed'
        errorMessage.value = 'Statut de paiement inconnu.'
        break
    }
  } catch (error: any) {
    console.error('Erreur lors de la vérification du statut:', error)
    paymentStatus.value = 'failed'
    errorMessage.value = error.message || 'Erreur lors de la vérification du paiement.'
  } finally {
    isChecking.value = false
  }
}

const retryPayment = () => {
  // Nettoyer l'identifier et retourner au profil pour relancer
  PaymentService.clearPaymentIdentifier()
  goToProfile()
}

const goToProfile = () => {
  router.push('/profile')
}
</script> 