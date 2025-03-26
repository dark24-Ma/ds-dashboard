<template>
    <!-- <admin-layout> -->
        <div class="p-6">
            <h1 class="text-2xl font-semibold mb-6 dark:text-white">Envoyer une Newsletter</h1>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <form @submit.prevent="handleSendNewsletter">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Titre
                        </label>
                        <input v-model="newsletterData.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contenu
                        </label>
                        <textarea v-model="newsletterData.content" rows="10" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input v-model="sendToAll" type="checkbox"
                                class="rounded border-gray-300 text-brand-500 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50" />
                            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Envoyer à tous les abonnés actifs
                            </span>
                        </label>
                    </div>

                    <div v-if="!sendToAll" class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sélectionner les destinataires
                        </label>
                        <div class="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                            <div v-for="subscriber in subscribers" :key="subscriber.id"
                                class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <input type="checkbox" v-model="selectedSubscribers" :value="subscriber.id"
                                    class="rounded border-gray-300 text-brand-500 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50" />
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {{ subscriber.email }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button type="submit" class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
                            :disabled="sending">
                            {{ sending ? 'Envoi en cours...' : 'Envoyer la newsletter' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    <!-- </admin-layout> -->

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NewsletterService from '@/services/NewsletterService'
import type { Subscriber } from '@/types/Newsletter'
// import AdminLayout from '@/components/layout/AdminLayout.vue'


const subscribers = ref<Subscriber[]>([])
const selectedSubscribers = ref<number[]>([])
const sendToAll = ref(true)
const sending = ref(false)
const newsletterData = ref({
    title: '',
    content: ''
})

onMounted(async () => {
    try {
        subscribers.value = await NewsletterService.getSubscribers()
    } catch (error) {
        console.error('Erreur lors du chargement des abonnés:', error)
    }
})

const handleSendNewsletter = async () => {
    try {
        sending.value = true
        const template = await NewsletterService.createTemplate({
            title: newsletterData.value.title,
            content: newsletterData.value.content,
            created_at: new Date()
        })

        await NewsletterService.sendNewsletter(
            template.id,
            sendToAll.value ? undefined : selectedSubscribers.value
        )

        // Réinitialiser le formulaire
        newsletterData.value = { title: '', content: '' }
        selectedSubscribers.value = []
        alert('Newsletter envoyée avec succès!')
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la newsletter:', error)
        alert('Erreur lors de l\'envoi de la newsletter')
    } finally {
        sending.value = false
    }
}
</script>