<template>
  <div>
    <div>{{filteredBoxes[0].title}}</div>
    <div v-for="commentObj in filteredBoxes[0].comments">
      <div v-for="comment in commentObj">
        {{comment.comment}} {{comment.commentOwnerName}}
        <div v-if="loggedIn === false"></div>
        <v-btn color="primary" v-else-if="comment.commentOwnerId == currentUser.uid" v-on:click="removeComment(comment.id)">
        ta väck</v-btn>
      </div>
    </div>
    <img v-bind:src="filteredBoxes[0].imageUrl">
    <v-text-field
      v-model="comment"
      label="Comment"
      multi-line>
    </v-text-field>
    <v-btn color="info" v-on:click="postComment">nahpsadus</v-btn>
    <p>{{loggedInError}}</p>
  </div>
</template>

<script>
import { boxesRef, db } from '../firebaseConfig';
export default {
  props: ['id', 'currentUser', 'loggedIn'],
	name: 'Info',
	data(){
		return {
      boxes: [],
      comment: '',
      loggedInError: ''
		}
	},
  created(){
      db.ref(`boxes`).on('value', (snapshot) => {
      let data = snapshot.val();
      let list = [];
      for(let key in data){
        let loopedData = data[key];
        for(let loopedKey in loopedData){
          loopedData[loopedKey].id = loopedKey;
          list.push(loopedData[loopedKey]);
        }
      }
      this.boxes = list;
    });
  },
  computed: {
    filteredBoxes(){
      return this.boxes.filter((item) => {
        return item.id === this.id;
      })
    }
  },
  methods: {
    postComment(){
      this.loggedInError = '';
      if(this.loggedIn){
        db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}`)
        .push({comment: this.comment, commentOwnerId: this.currentUser.uid, commentOwnerName: this.currentUser.displayName})
        .then((data) => {
          this.comment = '';
          db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}`)
          .child(data.key).update({id: data.key});
        })
      } else {
        this.loggedInError = 'You need to sign in to post a comment';
        this.comment = '';
      }
    },

    removeComment(id){
      db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}/${id}`)
      .remove();
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: 200px;
    height: 200px;
  }
</style>