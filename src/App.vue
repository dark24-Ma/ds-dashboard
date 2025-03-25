<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import SidebarProvider from '@/components/layout/SidebarProvider.vue'
// import { onBeforeMount, onMounted } from 'vue'
// import { startListening, stopListening } from '@/utils/IdleTimeout'
// import AuthService from '@/services/AuthService'

/* const logout = () => {
  AuthService.logout()
}

onMounted(() => {
  startListening(logout);
})

onBeforeMount(() => {
  stopListening()
}) */
</script>
