<template>
  <v-app>
    {{loggedIn}}
    <app-header></app-header>    
    <router-view/>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
import firebase from 'firebase';
export default {
  components: {
    'app-header': Header
  },
  data () {
    return {
      loggedIn: null
    }
  },
  name: 'App',
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }
}
</script>
