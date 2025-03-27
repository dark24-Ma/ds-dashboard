import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/signin',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/reset-password',
      name: 'Reset-Password',
      component: () => import('../views/Auth/Resetpassword.vue'),
      beforeEnter: (to, from, next) => {
        const token = to.query.token;
        if (!token) {
          next({ name: 'Signin' });
        } else {
          next()
        }
      },
      meta: {
        title: 'Reset Password'
      }
    },
    {
      path: '/newsletter',
      name: 'Newsletter',
      component: () => import('@/views/newsletter/SubscribersList.vue'),
      meta: {
        requiresAuth: true,
        title: 'Gestion Newsletter'
      }
    },
    {
      path: '/newsletter/send',
      name: 'SendNewsletter',
      component: () => import('@/views/newsletter/SendNewsletter.vue'),
      meta: {
        requiresAuth: true,
        title: 'Envoyer Newsletter'
      }
    },
    {
      path: '/newsletter/templates',
      name: 'NewsletterTemplates',
      component: () => import('../views/newsletter/TemplatesList.vue'),
      meta: {
        requiresAuth: true,
        title: 'Templates de newsletter'
      }
    },
    {
      path: '/newsletter/templates/create',
      name: 'CreateNewsletterTemplate',
      component: () => import('../views/newsletter/TemplateForm.vue'),
      meta: {
        requiresAuth: true,
        title: 'Créer un template de newsletter'
      }
    },
    {
      path: '/newsletter/templates/edit/:id',
      name: 'EditNewsletterTemplate',
      component: () => import('../views/newsletter/TemplateForm.vue'),
      meta: {
        requiresAuth: true,
        title: 'Modifier un template de newsletter'
      }
    },
    {
      path: '/courses',
      name: 'Courses',
      component: () => import('@/views/courses/CourseList.vue'),
      meta: {
        requiresAuth: true,
        title: 'Gestion des cours'
      }
    },
    {
      path: '/courses/create',
      name: 'CreateCourse',
      component: () => import('../views/courses/CourseForm.vue'),
      meta: {
        requiresAuth: true,
        title: 'Créer un cours'
      }
    },
    {
      path: '/courses/edit/:id',
      name: 'EditCourse',
      component: () => import('../views/courses/CourseForm.vue'),
      meta: {
        requiresAuth: true,
        title: 'Modifier un cours'
      }
    },
    {
      path: '/courses/:id',
      name: 'CourseDetail',
      component: () => import('../views/courses/CourseDetail.vue'),
      meta: {
        requiresAuth: true,
        title: 'Détail du cours'
      }
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
