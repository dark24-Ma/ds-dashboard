<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/dashboard">
        <!-- <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        /> -->
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in filteredMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" /> -->
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import BannerIcon from "@/icons/BannerIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import UserService from "@/services/UserService";
import UserSubscriptionService from "@/services/UserSubscriptionService";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

// État pour stocker les informations de l'utilisateur et son abonnement
const currentUser = ref(null);
const hasSubscription = ref(false);

// Charger les informations de l'utilisateur et son abonnement au montage du composant
onMounted(async () => {
  currentUser.value = UserService.getCurrentUser();
  if (currentUser.value) {
    try {
      hasSubscription.value = await UserSubscriptionService.hasActiveSubscription();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'abonnement:", error);
      hasSubscription.value = false;
    }
  }
});

const allMenuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: '/dashboard',
        requiresAdmin: false,
      },
      {
        icon: BoxCubeIcon,
        name: "Cours",
        path: '/courses',
        requiresAdmin: true,
      },
      {
        icon: BoxCubeIcon,
        name: "Mes Cours",
        path: '/my-courses',
        requiresAdmin: false,
        showOnlyForClient: true,
      },
      {
        icon: MailIcon,
        name: "News Letter",
        subItems: [
          {
            name: 'Abonnés',
            path: "/newsletter",
          },
          {
            name: 'Template',
            path: '/newsletter/templates'
          }
        ],
        requiresAdmin: true,
      },
      {
        icon: UserCircleIcon,
        name: "Abonnements",
        subItems: [
          {
            name: 'Types d\'abonnement',
            path: "/subscription-types",
          },
          {
            name: 'Abonnés',
            path: '/user-subscriptions'
          }
        ],
        requiresAdmin: true,
      },
      {
        icon: BannerIcon,
        name: "Bannières Publicitaires",
        path: '/banners',
        requiresAdmin: true,
      }
    ],
  },
];

// Filtrer les menus en fonction du type d'utilisateur et de l'état de l'abonnement
const filteredMenuGroups = computed(() => {
  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!currentUser.value) return [];
  
  // Si l'utilisateur est admin, afficher tous les menus sauf ceux spécifiques aux clients
  if (currentUser.value.userType === 'admin') {
    return allMenuGroups.map(group => ({
      ...group,
      items: group.items.filter(item => !item.showOnlyForClient)
    })).filter(group => group.items.length > 0);
  }
  
  // Pour les clients, n'afficher que les menus autorisés
  return allMenuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // Ne montrer que les éléments qui ne requièrent pas d'être admin
      if (item.requiresAdmin) return false;
      
      // Ne pas afficher les éléments qui nécessitent un abonnement si l'utilisateur n'en a pas
      if (item.requiresSubscription && !hasSubscription.value) return false;
      
      // Afficher les éléments spécifiques aux clients
      if (item.showOnlyForClient) return true;
      
      // Tous les autres éléments sont visibles
      return true;
    })
  })).filter(group => group.items.length > 0);
});

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return allMenuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      filteredMenuGroups.value[groupIndex]?.items[itemIndex]?.subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

// Transitions
function startTransition(element) {
  const height = element.scrollHeight;
  element.style.height = "0";
  element.offsetHeight; // Force reflow
  element.style.height = height + "px";
}

function endTransition(element) {
  element.style.height = "";
}
</script>
