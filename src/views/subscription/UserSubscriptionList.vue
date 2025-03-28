<template>
    <admin-layout>
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold dark:text-white">Abonnements des utilisateurs</h1>
                <router-link to="/user-subscriptions/create"
                    class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
                    Attribuer un abonnement
                </router-link>
            </div>

            <!-- Affichage des erreurs -->
            <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {{ error }}
            </div>

            <!-- Filtres -->
            <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div class="flex flex-col md:flex-row md:space-x-4">
                    <div class="mb-4 md:mb-0 flex-1">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Utilisateur
                        </label>
                        <input v-model="filters.userSearch" type="text" placeholder="Rechercher un utilisateur..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div class="mb-4 md:mb-0 flex-1">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Type d'abonnement
                        </label>
                        <select v-model="filters.subscriptionType"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Tous les types</option>
                            <option v-for="type in subscriptionTypes" :key="type.id" :value="type.id">
                                {{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Statut
                        </label>
                        <select v-model="filters.status"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="expired">Expiré</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Tableau des abonnements -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Utilisateur</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Type d'abonnement</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date de début</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date de fin</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Statut</th>
                            <th
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        <tr v-for="subscription in filteredSubscriptions" :key="subscription.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {{ subscription.user ? `${subscription.user.firstname} ${subscription.user.name}` : `Utilisateur #${subscription.userId}` }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ subscription.subscriptionType ? subscription.subscriptionType.name : 'Non défini' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(subscription.startDate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(subscription.endDate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(subscription.isActive)"
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ getStatusLabel(subscription.isActive) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button v-if="subscription.status === 'expired'"
                                        @click="renewSubscription(subscription.id, subscription.userId, subscription.subscriptionType.id)"
                                        class="text-brand-500 hover:text-brand-700 dark:hover:text-brand-400">
                                        Renouveler
                                    </button>
                                    <button v-else @click="cancelSubscription(subscription.id)"
                                        class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                        Annuler
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredSubscriptions.length">
                            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Aucun abonnement trouvé
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal de confirmation d'annulation -->
            <div v-if="showCancelModal"
                class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 class="text-xl font-semibold mb-4 dark:text-white">Confirmer l'annulation</h2>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">
                        Êtes-vous sûr de vouloir annuler cet abonnement ? L'utilisateur perdra l'accès aux contenus
                        premium.
                    </p>
                    <div class="flex justify-end space-x-3">
                        <button @click="showCancelModal = false"
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                            Annuler
                        </button>
                        <button @click="confirmCancelSubscription"
                            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import SubscriptionService from '@/services/SubscriptionService';
import type { SubscriptionType, UserSubscription } from '@/types/Subscription';

const router = useRouter();
const userSubscriptions = ref<UserSubscription[]>([]);
const subscriptionTypes = ref<SubscriptionType[]>([]);
const error = ref('');
const showCancelModal = ref(false);
const subscriptionToCancel = ref<string | null>(null);

const filters = reactive({
    userSearch: '',
    subscriptionType: '',
    status: ''
});

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        // Utiliser la nouvelle méthode qui récupère les informations complètes
        const [subscriptionsData, typesData] = await Promise.all([
            SubscriptionService.getUserSubscriptionsWithDetails(),
            SubscriptionService.getSubscriptionTypes()
        ]);
        
        userSubscriptions.value = subscriptionsData;
        subscriptionTypes.value = typesData;
        console.log('s ', subscriptionsData )
    } catch (err: any) {
        error.value = 'Erreur lors du chargement des données: ' + err.message;
    }
};

const filteredSubscriptions = computed(() => {
    return userSubscriptions.value.filter(sub => {
        const userFullName = sub.user ? 
            `${sub.user.firstname} ${sub.user.name}`.toLowerCase() : '';
        const userEmail = sub.user && sub.user.email ? 
            sub.user.email.toLowerCase() : '';
        
        const matchesUser = !filters.userSearch || 
            userFullName.includes(filters.userSearch.toLowerCase()) ||
            userEmail.includes(filters.userSearch.toLowerCase());
        
        const matchesType = !filters.subscriptionType || 
            (sub.subscriptionType && sub.subscriptionType.id === filters.subscriptionType);
        
        const matchesStatus = !filters.status || sub.status === filters.status;
        
        return matchesUser && matchesType && matchesStatus;
    });
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'active': return 'Actif';
        case 'expired': return 'Expiré';
        case 'cancelled': return 'Annulé';
        default: return status;
    }
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const cancelSubscription = (subscriptionId: string) => {
    subscriptionToCancel.value = subscriptionId;
    showCancelModal.value = true;
};

const confirmCancelSubscription = async () => {
    if (!subscriptionToCancel.value) return;

    try {
        await SubscriptionService.cancelSubscription(subscriptionToCancel.value);
        await fetchData();
        showCancelModal.value = false;
    } catch (err: any) {
        error.value = 'Erreur lors de l\'annulation de l\'abonnement: ' + err.message;
    }
};

const renewSubscription = async (subscriptionId: string, userId: string, subscriptionTypeId: string) => {
    try {
        await SubscriptionService.renewSubscription({
            userId,
            subscriptionTypeId
        });
        await fetchData();
    } catch (err: any) {
        error.value = 'Erreur lors du renouvellement de l\'abonnement: ' + err.message;
    }
};
</script>