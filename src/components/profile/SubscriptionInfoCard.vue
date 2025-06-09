<template>
  <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
      Mon Abonnement
    </h4>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>

    <div v-else-if="subscription" class="space-y-4">
      <!-- Type d'abonnement -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h5 class="font-medium text-gray-800 dark:text-white">{{ subscription.subscriptionType?.name }}</h5>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ subscription.subscriptionType?.description }}</p>
        </div>
        <span :class="getStatusClass(subscription.status)" 
          class="px-3 py-1 text-xs font-semibold rounded-full">
          {{ getStatusLabel(subscription.status) }}
        </span>
      </div>

      <!-- Détails de l'abonnement -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Date de début</p>
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDate(subscription.startDate) }}</p>
        </div>

        <div>
          <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Date d'expiration</p>
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDate(subscription.endDate) }}</p>
        </div>

        <div>
          <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Prix payé</p>
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ subscription.subscriptionType?.price }} FCFA</p>
        </div>

        <div>
          <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Durée</p>
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ subscription.subscriptionType?.duration }} jours</p>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="subscription.status === 'expired'" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="contactSupport" 
          class="w-full px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
          Renouveler mon abonnement
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <div class="mb-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h5 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Aucun abonnement actif</h5>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Vous n'avez pas d'abonnement en cours. Contactez l'administrateur pour obtenir un accès.
      </p>
      <button @click="contactSupport" 
        class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
        Contacter le support
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-300">
      {{ error }}
    </div>

    <!-- Plans d'abonnement disponibles -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h5 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        <span v-if="subscription">
          Autres plans d'abonnement disponibles
        </span>
        <span v-else>
          Plans d'abonnement disponibles
        </span>
      </h5>
      
      <div v-if="loadingPlans" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
      </div>

      <div v-else-if="availablePlans.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="plan in availablePlans" :key="plan.id" 
          :class="[
            'relative p-6 border rounded-xl transition-all duration-300 hover:shadow-lg',
            isCurrentPlan(plan.id || '') 
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-300'
          ]">
          
          <!-- Badge pour le plan actuel -->
          <div v-if="isCurrentPlan(plan.id || '')" 
            class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Votre plan actuel
            </span>
          </div>

          <!-- Badge niveau -->
          <div class="flex items-center justify-between mb-3">
            <h6 class="text-lg font-semibold text-gray-800 dark:text-white">{{ plan.name }}</h6>
            <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
              Niveau {{ plan.level }}
            </span>
          </div>

          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ plan.description }}</p>

          <!-- Prix -->
          <div class="mb-4">
            <div class="flex items-baseline">
              <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ plan.price }}</span>
              <span class="text-gray-500 dark:text-gray-400 ml-1">FCFA</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ plan.duration }} jours</p>
          </div>

          <!-- Fonctionnalités -->
          <div v-if="plan.features && plan.features.length > 0" class="mb-4">
            <h7 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Fonctionnalités :
            </h7>
            <ul class="space-y-1">
              <li v-for="(feature, index) in plan.features" :key="index" 
                class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Bouton d'action -->
          <div class="mt-4">
            <button v-if="!subscription" 
              @click="requestPlan(plan)"
              class="w-full py-2 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
              Choisir ce plan
            </button>
            <button v-else-if="canUpgrade(plan)" 
              @click="requestUpgrade(plan)"
              class="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
              Passer à ce plan
            </button>
            <button v-else-if="canDowngrade(plan)" 
              @click="requestDowngrade(plan)"
              class="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
              </svg>
              Rétrograder vers ce plan
            </button>
            <button v-else 
              @click="requestChange(plan)"
              class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Changer pour ce plan
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
        <div v-if="subscription">
          Vous avez déjà souscrit au meilleur plan disponible !
        </div>
        <div v-else>
          Aucun plan d'abonnement disponible
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService from '@/services/UserService'
import UserSubscriptionService from '@/services/UserSubscriptionService'
import SubscriptionService from '@/services/SubscriptionService'
import PaymentService from '@/services/PaymentService'
import type { UserSubscription, SubscriptionType } from '@/types/Subscription'

const subscription = ref<UserSubscription | null>(null)
const subscriptionPlans = ref<SubscriptionType[]>([])
const availablePlans = ref<SubscriptionType[]>([])
const loading = ref(true)
const loadingPlans = ref(true)
const error = ref('')

onMounted(async () => {
  await Promise.all([loadSubscription(), loadSubscriptionPlans()])
})

const loadSubscription = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const currentUser = UserService.getCurrentUser()
    if (!currentUser?.id) {
      error.value = 'Utilisateur non connecté'
      return
    }

    subscription.value = await UserSubscriptionService.getUserSubscription(currentUser.id)
    
    // Refiltrer les plans après chargement de l'abonnement
    if (subscriptionPlans.value.length > 0) {
      filterAvailablePlans()
    }
  } catch (err: any) {
    error.value = 'Erreur lors du chargement de l\'abonnement: ' + err.message
  } finally {
    loading.value = false
  }
}

const loadSubscriptionPlans = async () => {
  try {
    loadingPlans.value = true
    subscriptionPlans.value = await SubscriptionService.getSubscriptionTypes()
    // Trier par niveau
    subscriptionPlans.value.sort((a, b) => (a.level || 1) - (b.level || 1))
    
    // Filtrer les plans pour n'afficher que ceux différents du plan actuel
    filterAvailablePlans()
  } catch (err: any) {
    console.error('Erreur lors du chargement des plans:', err)
  } finally {
    loadingPlans.value = false
  }
}

const filterAvailablePlans = () => {
  const currentPlanId = subscription.value?.subscriptionType?.id
  
  if (!currentPlanId) {
    // Si pas d'abonnement actuel, afficher tous les plans
    availablePlans.value = subscriptionPlans.value
  } else {
    // Filtrer pour exclure le plan actuel
    availablePlans.value = subscriptionPlans.value.filter(plan => plan.id !== currentPlanId)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Actif'
    case 'expired': return 'Expiré'
    case 'cancelled': return 'Annulé'
    default: return status
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const isCurrentPlan = (planId: string) => {
  return subscription.value?.subscriptionType?.id === planId
}

const canUpgrade = (plan: SubscriptionType) => {
  if (!subscription.value) return false
  const currentLevel = subscription.value.subscriptionType?.level || 0
  const planLevel = plan.level || 1
  return planLevel > currentLevel
}

const canDowngrade = (plan: SubscriptionType) => {
  if (!subscription.value) return false
  const currentLevel = subscription.value.subscriptionType?.level || 0
  const planLevel = plan.level || 1
  return planLevel < currentLevel
}

const requestUpgrade = async (plan: SubscriptionType) => {
  try {
    const currentUser = UserService.getCurrentUser()
    if (!currentUser?.id) {
      alert('Vous devez être connecté pour effectuer un upgrade')
      return
    }

    if (!plan.id) {
      alert('Erreur: ID du plan manquant')
      return
    }

    // Initier le paiement d'upgrade
    const paymentResponse = await PaymentService.initiateUpgradePayment({
      userId: currentUser.id,
      newSubscriptionTypeId: plan.id
    })

    // Sauvegarder l'identifier pour le suivi
    PaymentService.savePaymentIdentifier(paymentResponse.identifier)

    // Confirmer avec l'utilisateur
    const confirmed = confirm(
      `Vous allez être redirigé vers PayGate pour payer ${paymentResponse.amount} FCFA pour l'upgrade vers "${plan.name}". Continuer?`
    )

    if (confirmed) {
      // Rediriger vers PayGate
      PaymentService.redirectToPayment(paymentResponse.paymentUrl)
    }
  } catch (error: any) {
    alert(`Erreur lors de l'initiation du paiement: ${error.message}`)
  }
}

const requestPlan = async (plan: SubscriptionType) => {
  try {
    const currentUser = UserService.getCurrentUser()
    if (!currentUser?.id) {
      alert('Vous devez être connecté pour souscrire à un abonnement')
      return
    }

    if (!plan.id) {
      alert('Erreur: ID du plan manquant')
      return
    }

    // Initier le paiement pour un nouvel abonnement
    const paymentResponse = await PaymentService.initiateNewSubscriptionPayment({
      userId: currentUser.id,
      newSubscriptionTypeId: plan.id
    })

    // Sauvegarder l'identifier pour le suivi
    PaymentService.savePaymentIdentifier(paymentResponse.identifier)

    // Confirmer avec l'utilisateur
    const confirmed = confirm(
      `Vous allez être redirigé vers PayGate pour payer ${paymentResponse.amount} FCFA pour l'abonnement "${plan.name}". Continuer?`
    )

    if (confirmed) {
      // Rediriger vers PayGate
      PaymentService.redirectToPayment(paymentResponse.paymentUrl)
    }
  } catch (error: any) {
    alert(`Erreur lors de l'initiation du paiement: ${error.message}`)
  }
}

const requestDowngrade = async (plan: SubscriptionType) => {
  // Pour un downgrade, on peut utiliser la même logique que l'upgrade
  // mais avec une confirmation spéciale
  const confirmed = confirm(
    `Attention: Vous allez rétrograder vers un plan de niveau inférieur "${plan.name}". Certaines fonctionnalités pourraient ne plus être disponibles. Continuer?`
  )
  
  if (confirmed) {
    await requestUpgrade(plan) // Même processus de paiement
  }
}

const requestChange = async (plan: SubscriptionType) => {
  // Pour un changement de plan de même niveau, utiliser la même logique
  const confirmed = confirm(
    `Vous allez changer votre abonnement pour "${plan.name}". Continuer?`
  )
  
  if (confirmed) {
    await requestUpgrade(plan) // Même processus de paiement
  }
}

const refreshSubscription = async () => {
  await loadSubscription()
  // Refiltrer les plans après rechargement de l'abonnement
  filterAvailablePlans()
}

// Exposer la méthode pour pouvoir l'appeler depuis l'extérieur
defineExpose({
  refreshSubscription
})

const contactSupport = () => {
  // Ici vous pouvez ajouter la logique pour contacter le support
  // Par exemple, ouvrir une modal, rediriger vers une page de contact, etc.
  alert('Fonctionnalité de contact du support à implémenter')
}
</script> 