<template>
  <div v-if="activeBanners.length > 0" class="banner-carousel mb-6">
    <div class="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="banner in activeBanners" 
          :key="banner.id"
          class="w-full flex-shrink-0 relative"
        >
          <div 
            class="relative h-48 md:h-64 lg:h-80 cursor-pointer group overflow-hidden"
            @click="handleBannerClick(banner)"
          >
            <img 
              :src="getImageUrl(banner.imageUrl)" 
              :alt="banner.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              @load="trackImpression(banner.id)"
              @error="handleImageError"
            />
            
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Content overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 class="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{{ banner.title }}</h3>
              <p v-if="banner.description" class="text-sm md:text-base opacity-90 line-clamp-2">
                {{ banner.description }}
              </p>
              
              <!-- Call to action button -->
              <button 
                v-if="banner.linkUrl"
                class="mt-4 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                En savoir plus
              </button>
            </div>
            
            <!-- Click overlay for better accessibility -->
            <div class="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors duration-200"></div>
          </div>
        </div>
      </div>
      
      <!-- Navigation arrows -->
      <button 
        v-if="activeBanners.length > 1"
        @click="previousSlide"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
        aria-label="Bannière précédente"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      
      <button 
        v-if="activeBanners.length > 1"
        @click="nextSlide"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
        aria-label="Bannière suivante"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      
      <!-- Dots indicator -->
      <div 
        v-if="activeBanners.length > 1"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
      >
        <button
          v-for="(banner, index) in activeBanners"
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'w-3 h-3 rounded-full transition-colors duration-200',
            index === currentIndex 
              ? 'bg-white' 
              : 'bg-white/50 hover:bg-white/70'
          ]"
          :aria-label="`Aller à la bannière ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BannerService from '@/services/BannerService';
import type { Banner } from '@/types/Banner';

const activeBanners = ref<Banner[]>([]);
const currentIndex = ref(0);
const loading = ref(true);
const autoSlideInterval = ref<number | null>(null);

// Configuration
const AUTO_SLIDE_DURATION = 5000; // 5 secondes

const loadActiveBanners = async () => {
  try {
    loading.value = true;
    const banners = await BannerService.getActiveBanners();
    activeBanners.value = banners.sort((a, b) => a.displayOrder - b.displayOrder);
    
    // Démarrer l'auto-slide si il y a plusieurs bannières
    if (activeBanners.value.length > 1) {
      startAutoSlide();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des bannières:', error);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imageUrl: string | undefined) => {
  return BannerService.getImageUrl(imageUrl);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/cards/card-01.png'; // Image de fallback
};

const handleBannerClick = (banner: Banner) => {
  if (banner.linkUrl) {
    // Tracker le clic
    if (banner.id) {
      BannerService.trackBannerClick(banner.id);
    }
    
    // Rediriger vers le lien
    if (banner.linkUrl.startsWith('http')) {
      window.open(banner.linkUrl, '_blank');
    } else {
      window.location.href = banner.linkUrl;
    }
  }
};

const trackImpression = (bannerId: string | undefined) => {
  if (bannerId) {
    BannerService.trackBannerImpression(bannerId);
  }
};

const nextSlide = () => {
  if (activeBanners.value.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length;
    resetAutoSlide();
  }
};

const previousSlide = () => {
  if (activeBanners.value.length > 1) {
    currentIndex.value = currentIndex.value === 0 
      ? activeBanners.value.length - 1 
      : currentIndex.value - 1;
    resetAutoSlide();
  }
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  resetAutoSlide();
};

const startAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
  }
  
  autoSlideInterval.value = window.setInterval(() => {
    nextSlide();
  }, AUTO_SLIDE_DURATION);
};

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
    autoSlideInterval.value = null;
  }
};

const resetAutoSlide = () => {
  stopAutoSlide();
  if (activeBanners.value.length > 1) {
    startAutoSlide();
  }
};

onMounted(() => {
  loadActiveBanners();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-carousel {
  user-select: none;
}
</style> 