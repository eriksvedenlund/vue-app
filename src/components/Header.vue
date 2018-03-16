<template>
  <v-toolbar>
  	<div><router-link to="/">Vue app</router-link></div>
    <v-layout row v-bind:style="{justifyContent: 'flex-end'}">
      <div v-if="currentUser">
        <v-icon left>account_circle</v-icon>
        {{currentUser.displayName}}
        <v-btn color="primary" v-on:click="signOut">sign out</v-btn>
      </div>  
  	  <v-dialog v-if="loggedIn === false" v-model="showSignUp" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator">Sign Up</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Sign Up</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Username" v-model="userName"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email" type="email" v-model="signUpEmail"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password" v-model="signUpPassword"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Confirm Password" type="password" v-model="signUpConfirmPassword"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <p>{{signUpError}}</p>
          <v-btn color="primary" @click.native="closeSignUp">Close</v-btn>
          <v-btn color="primary" @click.native="signUp">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="loggedIn === false" v-model="showSignIn" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator">Sign In</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Sign In</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Email" type="email" v-model="signInEmail"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password" v-model="signInPassword"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <p>{{signInError}}</p>
          <v-btn color="primary" @click.native="closeSignIn">Close</v-btn>
          <v-btn color="primary" @click.native="signIn">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-toolbar>
</template>

<script>
import firebase from 'firebase';

export default {
  props: ['currentUser', 'loggedIn'],
  data () {
    return {
        showSignUp: false,
      	showSignIn: false,
      	userName: '',
    		signInEmail: '',
    		signInPassword: '',
    		signInError: '',
    		signUpEmail: '',
    		signUpPassword: '',
    		signUpConfirmPassword: '',
    		signInError: '',
    		signUpError: ''	
    }
  },
  name: 'Header',
  methods: {
  	signUp(){
		if(this.userName !== ''){
			if(this.signUpPassword === this.signUpConfirmPassword){
				if(this.signUpPassword.length >= 6 || this.signUpConfirmPassword.length >= 6){
					firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
						.then((user) => {
							user.updateProfile({ displayName: this.userName });
							this.showSignUp = false;
              this.userName = '';
              this.signUpError = '';
              this.signUpEmail = '';
              this.signUpPassword = '';
              this.signUpConfirmPassword = '';
						})
						.catch(() => {
							this.signUpError = 'Email is invalid';
						});
				} else {
					this.signUpError = 'Password must be atleast 6 characters';
				}
			} else {
				this.signUpError = 'Passwords not matching';
			}
		} else {
			this.signUpError = 'Please enter a user name';
		}
  	},

  	signOut(){
  		firebase.auth().signOut();
  	},

    signIn(){
      if(this.signInEmail !== '' && this.signInPassword !== ''){
        firebase.auth().signInWithEmailAndPassword(this.signInEmail, this.signInPassword)
          .then((user) => {
              this.showSignIn = false;
              this.signInEmail = '';
              this.signInPassword = '';
              this.signInError = '';
          })
          .catch(() => {
            this.signInError = 'Wrong Email or Password';
          });
      }
      else {
        this.signInError = 'Please fill out both fields';
      }
    },

    closeSignIn(){
      this.showSignIn = false;
      this.signInEmail = '';
      this.signInPassword = '';
      this.signInError = '';
    },

    closeSignUp(){
      this.showSignUp = false;
      this.signUpEmail = '';
      this.signUpPassword = '';
      this.signUpError = '';
      this.userName = '';
      this.signUpConfirmPassword = '';
    }
  }
}
</script>
