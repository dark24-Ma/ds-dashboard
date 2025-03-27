<template>
    <admin-layout>
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold dark:text-white">Gestion des Templates Newsletter</h1>
                <button @click="navigateToCreateTemplate"
                    class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                    Créer un template
                </button>
            </div>

            <!-- Affichage des erreurs -->
            <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {{ error }}
            </div>

            <!-- Tableau des templates -->
            <div v-if="loading" class="flex justify-center my-8">
                <div class="spinner"></div>
            </div>

            <div v-else-if="templates.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <p class="text-gray-500 dark:text-gray-400">Aucun template disponible.</p>
            </div>

            <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Titre
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date de création
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
                        <tr v-for="template in templates" :key="template.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ template.subject }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {{ formatDate(template.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-green-100 text-green-800': template.status === 'published',
                                    'bg-gray-100 text-gray-800': template.status === 'draft'
                                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ template.status === 'published' ? 'Publié' : 'Brouillon' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex space-x-2">
                                    <button @click="editTemplate(template.id)"
                                        class="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">
                                        Modifier
                                    </button>
                                    <button @click="confirmSendNewsletter(template)"
                                        class="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                                        Envoyer
                                    </button>
                                    <button @click="confirmDeleteTemplate(template.id)"
                                        class="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                        Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal de confirmation pour l'envoi -->
            <Modal v-if="showSendModal" @close="showSendModal = false">
                <template #body>
                    <div class="p-6">
                        <h2 class="text-xl font-semibold mb-4 dark:text-white">Envoyer la newsletter</h2>
                        <p class="mb-4 text-gray-600 dark:text-gray-400">
                            Vous êtes sur le point d'envoyer le template "{{ selectedTemplate?.subject }}" à vos
                            abonnés.
                        </p>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Destinataires
                            </label>
                            <div class="flex items-center mb-2">
                                <input type="radio" id="all-subscribers" v-model="sendToAll" :value="true" class="mr-2">
                                <label for="all-subscribers" class="text-sm text-gray-700 dark:text-gray-400">
                                    Tous les abonnés actifs
                                </label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" id="select-subscribers" v-model="sendToAll" :value="false"
                                    class="mr-2">
                                <label for="select-subscribers" class="text-sm text-gray-700 dark:text-gray-400">
                                    Sélectionner des destinataires
                                </label>
                            </div>
                        </div>

                        <div v-if="!sendToAll" class="mb-4">
                            <div class="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                                <div v-if="subscribers.length === 0" class="p-2 text-gray-500 dark:text-gray-400">
                                    Chargement des abonnés...
                                </div>
                                <div v-else v-for="subscriber in subscribers" :key="subscriber.id"
                                    class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <input type="checkbox" v-model="selectedSubscribers" :value="subscriber.id"
                                        class="rounded border-gray-300">
                                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        {{ subscriber.email }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button @click="showSendModal = false"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                                Annuler
                            </button>
                            <button @click="sendNewsletter" :disabled="sendingNewsletter"
                                class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                                {{ sendingNewsletter ? 'Envoi en cours...' : 'Envoyer' }}
                            </button>
                        </div>
                    </div>
                </template>
            </Modal>

            <!-- Modal de confirmation pour la suppression -->
            <Modal v-if="showDeleteModal" @close="showDeleteModal = false">
                <template #body>
                    <div class="p-6">
                        <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer la suppression</h2>
                        <p class="mb-4 text-gray-600 dark:text-gray-400">
                            Êtes-vous sûr de vouloir supprimer ce template ? Cette action est irréversible.
                        </p>
                        <div class="flex justify-end space-x-3">
                            <button @click="showDeleteModal = false"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                                Annuler
                            </button>
                            <button @click="deleteTemplate" :disabled="deleting"
                                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                {{ deleting ? 'Suppression...' : 'Supprimer' }}
                            </button>
                        </div>
                    </div>
                </template>
            </Modal>
        </div>
    </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import Modal from '@/components/common/Modal.vue';
//   import NewsletterService from '@/services/NewsletterService';
import NewsLetterService from '@/services/NewsLetterService';
import SubscriberService from '@/services/SubscriberService';
// import type { NewsletterTemplate, Subscriber } from '@/types/Newsletter';
import type { NewsletterTemplate, Subscriber } from '@/types/Newsletter';

const router = useRouter();
const templates = ref<NewsletterTemplate[]>([]);
const subscribers = ref<Subscriber[]>([]);
const loading = ref(true);
const error = ref('');

// États pour l'envoi de newsletter
const showSendModal = ref(false);
const selectedTemplate = ref<NewsletterTemplate | null>(null);
const sendToAll = ref(true);
const selectedSubscribers = ref<string[]>([]);
const sendingNewsletter = ref(false);

// États pour la suppression
const showDeleteModal = ref(false);
const templateIdToDelete = ref<string | null>(null);
const deleting = ref(false);

onMounted(async () => {
    try {
        await loadTemplates();
    } catch (err: any) {
        error.value = 'Erreur lors du chargement des templates: ' + err.message;
    } finally {
        loading.value = false;
    }
});

const loadTemplates = async () => {
    templates.value = await NewsLetterService.getTemplates();
};

const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
};

const navigateToCreateTemplate = () => {
    router.push('/newsletter/templates/create');
};

const editTemplate = (id: string | undefined) => {
    if (id) {
        router.push(`/newsletter/templates/edit/${id}`);
    }
};

const confirmSendNewsletter = async (template: NewsletterTemplate) => {
    selectedTemplate.value = template;
    sendToAll.value = true;
    selectedSubscribers.value = [];

    // Charger les abonnés si nécessaire
    if (subscribers.value.length === 0) {
        try {
            subscribers.value = await SubscriberService.getSubscribers();
        } catch (err: any) {
            console.error("Erreur lors du chargement des abonnés:", err);
        }
    }

    showSendModal.value = true;
};

const sendNewsletter = async () => {
    if (!selectedTemplate.value?.id) return;

    try {
        sendingNewsletter.value = true;

        await NewsLetterService.sendNewsletter({
            // templateId: selectedTemplate.value.id,
            recipientIds: sendToAll.value ? undefined : selectedSubscribers.value
        }, selectedTemplate.value.id,);

        showSendModal.value = false;
        alert('Newsletter envoyée avec succès');
    } catch (err: any) {
        alert('Erreur lors de l\'envoi de la newsletter: ' + err.message);
    } finally {
        sendingNewsletter.value = false;
    }
};

const confirmDeleteTemplate = (id: string | undefined) => {
    if (id) {
        templateIdToDelete.value = id;
        showDeleteModal.value = true;
    }
};

const deleteTemplate = async () => {
    if (!templateIdToDelete.value) return;

    try {
        deleting.value = true;

        await NewsLetterService.deleteTemplate(templateIdToDelete.value);

        // Recharger la liste après suppression
        await loadTemplates();

        showDeleteModal.value = false;
    } catch (err: any) {
        alert('Erreur lors de la suppression du template: ' + err.message);
    } finally {
        deleting.value = false;
    }
};
</script>

<style scoped>
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>