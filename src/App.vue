<template>
  <v-app>
    <app-header></app-header>    
    <router-view/>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
export default {
  components: {
    'app-header': Header
  },
  data () {
    return {
      
    }
  },
  name: 'App'
}
</script>
