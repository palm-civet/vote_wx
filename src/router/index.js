import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import VotePage from '@/views/votePage'
import ChatPage from '@/views/chatPage'
import DetailPage from '@/views/detailPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', name: 'index', component: index,
      children: [{
        path: 'v_vote/:activity_id',
        component: VotePage
      },{
        path: 'v_chat/:activity_id',
        component: ChatPage
      },{
        path: 'v_detail/:activity_id',
        component: DetailPage
      }]
    }
  ]
})
