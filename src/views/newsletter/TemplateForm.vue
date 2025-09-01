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
                    {{ isEditing ? 'Modifier le template' : 'Créer un nouveau template' }}
                </h1>
            </div>

            <!-- Affichage des erreurs -->
            <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {{ error }}
            </div>

            <!-- Formulaire -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <form @submit.prevent="saveTemplate">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                            Titre *
                        </label>
                        <input v-model="template.subject" type="text" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                            Contenu du template *
                        </label>
                        <div class="border border-gray-300 rounded-lg dark:border-gray-600">
                            <!-- Remplacez ceci par un éditeur riche si disponible -->
                            <textarea v-model="template.content" rows="10" required
                                class="w-full px-4 py-2 border-0 rounded-lg focus:ring-0 dark:bg-gray-700 dark:text-white"></textarea>
                        </div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Vous pouvez utiliser du HTML dans le contenu pour plus de personnalisation.
                        </p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                            Statut
                        </label>
                        <select v-model="template.status"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                        </select>
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

            <!-- Aperçu du template -->
            <div class="mt-8">
                <h2 class="text-xl font-semibold mb-4 dark:text-white">Aperçu</h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-2 dark:text-white">{{ template.name || 'Titre du template' }}
                    </h3>
                    <div class="prose dark:prose-invert max-w-none" v-html="template.content || 'Contenu du template'">
                    </div>
                </div>
            </div>
        </div>
    </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
// import NewsLetterService from '@/services/NewsletterService';
import type { NewsletterTemplate } from '@/types/NewsLetter';
import NewsLetterService from '@/services/NewsLetterService';

const router = useRouter();
const route = useRoute();

const template = reactive<NewsletterTemplate>({
    name: '',
    content: '',
    status: 'draft',
    subject: ''
});

const error = ref('');
const saving = ref(false);
const isEditing = computed(() => !!route.params.id);

onMounted(async () => {
    if (isEditing.value) {
        try {
            const templateId = route.params.id as string;
            // const data = await NewsletterService.getTemplateById(templateId);
            const data = await NewsLetterService.getTemplateById(templateId)
            // Mise à jour des champs du formulaire
            Object.assign(template, data);
        } catch (err: any) {
            error.value = 'Erreur lors du chargement du template: ' + err.message;
        }
    }
});

const saveTemplate = async () => {
    try {
        saving.value = true;
        error.value = '';

        if (isEditing.value) {
            await NewsLetterService.updateTemplate(route.params.id as string, template);
        } else {
            await NewsLetterService.createTemplate(template);
        }

        router.push('/newsletter/templates');
    } catch (err: any) {
        error.value = 'Erreur lors de l\'enregistrement du template: ' + err.message;
    } finally {
        saving.value = false;
    }
};
</script>
