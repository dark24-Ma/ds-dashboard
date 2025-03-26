<template>
    <admin-layout>
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold dark:text-white">Gestion des Abonnés Newsletter</h1>
                <button @click="showAddSubscriberModal = true"
                    class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                    Ajouter un abonné
                </button>
            </div>

            <!-- Tableau des abonnés -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Email
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date d'inscription
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Statut
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="subscriber in subscribers" :key="subscriber.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ subscriber.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {{ new Date(subscriber.subscribedAt).toLocaleDateString() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-green-100 text-green-800': subscriber.isSubscribed === true,
                                    'bg-red-100 text-red-800': subscriber.isSubscribed === false
                                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ subscriber.isSubscribed }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="removeSubscriber(subscriber.email)"
                                    class="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal d'ajout d'abonné -->
            <div v-if="showAddSubscriberModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                    <h2 class="text-xl font-semibold mb-4 dark:text-white">Ajouter un abonné</h2>
                    <form @submit.prevent="handleAddSubscriber">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input v-model="newSubscriberEmail" type="email" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" @click="showAddSubscriberModal = false"
                                class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </admin-layout>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NewsletterService from '@/services/NewsLetterService'
import type { Subscriber } from '@/types/Newsletter'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const subscribers = ref<Subscriber[]>([])
const showAddSubscriberModal = ref(false)
const newSubscriberEmail = ref('')

// Fonction pour charger les abonnés
const loadSubscribers = async () => {
    try {
        subscribers.value = await NewsletterService.getSubscribers()
    } catch (error) {
        console.error('Erreur lors du chargement des abonnés:', error)
    }
}

onMounted(() => {
    loadSubscribers()
})

const handleAddSubscriber = async () => {
    try {
        await NewsletterService.addSubscriber(newSubscriberEmail.value)
        showAddSubscriberModal.value = false
        newSubscriberEmail.value = ''
        // Recharger la liste après l'ajout
        await loadSubscribers()
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'abonné:', error)
    }
}

const removeSubscriber = async (email: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
        try {
            await NewsletterService.removeSubscriber(email)
            // Recharger la liste après la suppression
            await loadSubscribers()
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'abonné:', error)
        }
    }
}
</script>