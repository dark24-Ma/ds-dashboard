<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[90vh] overflow-hidden">
        <slot name="body"></slot>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  defineEmits(['close']);
  </script>