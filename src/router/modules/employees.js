import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      name:'employees',
      path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon:'people'
      }
    },
    {
      name: 'employeesDetail',
      path: 'detail',
      component: () => import('@/views/employees/detail.vue'),
      hidden:true,
      
    }
  ]
}