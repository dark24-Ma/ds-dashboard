<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Objectifs Mensuels</h3>

      <div class="relative h-fit">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                fill="currentColor"
              />
            </svg>
          </template>
        </DropdownMenu>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="monthlyTargetChart" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="line" height="250" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DropdownMenu from '../common/DropdownMenu.vue'
import VueApexCharts from 'vue3-apexcharts'
import DashboardStatisticsService from '../../services/DashboardStatisticsService'

const menuItems = [
  { label: 'Voir plus', onClick: () => console.log('View More clicked') },
  { label: 'Supprimer', onClick: () => console.log('Delete clicked') },
]

const series = ref([
  {
    name: 'Objectifs',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
])

const chartOptions = ref({
  colors: ['#10B981'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  markers: {
    size: 5,
    colors: ['#10B981'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    categories: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Jun',
      'Jul',
      'Aoû',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: {
      text: 'Nombre de souscriptions',
      style: {
        fontSize: '12px',
        fontWeight: 400,
        color: '#6B7280',
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return val + ' souscriptions'
      },
    },
  },
})

const loadMonthlyTargetData = async () => {
  try {
    const data = await DashboardStatisticsService.getMonthlyTargetData();
    series.value = data.series;
  } catch (error) {
    console.error('Erreur lors du chargement des données d\'objectifs mensuels:', error);
  }
}

onMounted(() => {
  loadMonthlyTargetData();
})
</script>

<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}
</style>
