<template>
  <v-app>
    <app-header v-bind:currentUser="currentUser" v-bind:loggedIn="loggedIn"></app-header>    
    <router-view v-bind:currentUser="currentUser" v-bind:loggedIn="loggedIn"/>
  </v-app>
</template>

<script>
import Header from './components/Header';
import firebase from 'firebase';
export default {
  components: {
    'app-header': Header
  },
  data () {
    return {
      loggedIn: null,
      currentUser: null
    }
  },
  name: 'App',
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.loggedIn = true;
        this.currentUser = user;
      } else {
        this.loggedIn = false;
        this.currentUser = null;
      }
    });
  }
}
</script>

<style>
  .application {
    line-height: normal;
  }

  a {
    text-decoration: none;
    color: #424242 !important;
  }
</style>