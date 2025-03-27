<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Prénoms</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ currentUser?.firstname }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nom</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ currentUser?.name }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email 
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ currentUser?.email }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ currentUser?.phonenumber || 'N/A' }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Type</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ currentUser?.userType }}</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import Modal from './Modal.vue'
import UserService from '@/services/UserService'
import type { User } from '@/types/User'

const currentUser = ref<User | null>(null)

onMounted(() => {
  loadUserInfo()
})

const loadUserInfo = () => {
  currentUser.value = UserService.getCurrentUser()
}


</script>
