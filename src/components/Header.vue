<template>
  <v-toolbar>
  	<div>Vue app</div>
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
                <v-text-field label="Username"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Confirm Password" type="password"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="showSignUp = false">Close</v-btn>
          <v-btn color="primary" @click.native="showSignUp = false">Submit</v-btn>
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
          <v-btn color="primary" @click.native="showSignIn = false">Close</v-btn>
          <v-btn color="primary" @click.native="showSignIn = false">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-toolbar>
</template>

<script>
export default {
  data () {
    return {
      showSignUp: false,
      showSignIn: false
    }
  },
  name: 'Header'
}
</script>
