<template>
  <v-toolbar>
  	<div>Vue app</div>
  	<v-btn color="primary" v-on:click="signOut">sign out</v-btn>
  	<v-layout row justify-space-around>
  	  <v-dialog v-model="showSignUp" persistent max-width="500px">
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
                <v-text-field label="Email" v-model="signUpEmail"></v-text-field>
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
          <v-btn color="primary" @click.native="showSignUp = false">Close</v-btn>
          <v-btn color="primary" @click.native="signUp">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSignIn" persistent max-width="500px">
      <v-btn color="primary" dark slot="activator">Sign In</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Sign In</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Email"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <p>{{signInError}}</p>
          <v-btn color="primary" @click.native="showSignIn = false">Close</v-btn>
          <v-btn color="primary" @click.native="showSignIn = false">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-toolbar>
</template>

<script>
import firebase from 'firebase';

export default {
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
  	signUp: function(){
		if(this.userName !== ''){
			if(this.signUpPassword === this.signUpConfirmPassword){
				if(this.signUpPassword.length >= 6 || this.signUpConfirmPassword.length >= 6){
					firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
						.then((user) => {
							user.updateProfile({ displayName: this.userName });
							this.showSignUp = false;
						})
						.catch(() => {
							this.signUpError = 'User already exist';
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

  	signOut: function(){
  		firebase.auth().signOut();
  	}
  }
}
</script>
