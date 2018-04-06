import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home';
import Info from '../components/Info';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/vue-app',
      name: 'Home',	
      component: Home
    },
    {
    	path: '/info/:id',
    	name: 'Info',
    	component: Info,
    	props: true
    }
  ]
})
