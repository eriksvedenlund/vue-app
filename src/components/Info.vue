<template>
  <div class="infoWrapper">
    <div class="infoContainer">
      <h2>{{filteredBoxes[0].title}}</h2>
      <div class="voteContainer">
        <div>{{filteredBoxes[0].displayName}}</div>
        <div>
          <v-icon v-bind:class="{upvoted : userVote > 0}" class="thumb" v-on:click="upVote">thumb_up</v-icon>  
          <span>{{allVotes}}</span>
          <v-icon v-bind:class="{downvoted : userVote < 0}" class="thumb" v-on:click="downVote">thumb_down</v-icon>
        </div>
      </div>
      <img v-bind:src="filteredBoxes[0].imageUrl">
      <v-text-field
        class="commentInput"
        v-model="comment"
        label="Comment"
        multi-line
        :no-resize="true"
        append-icon="send"
        :append-icon-cb="postComment"
        rows="2">
      </v-text-field>
      <p v-bind:style="{textAlign:'center'}">{{errorMsg}}</p>
      <div v-for="commentObj in filteredBoxes[0].comments">
        <div v-for="comment in commentObj" class="commentContainer">
          <h4 class="voteContainer">
            {{comment.commentOwnerName}}
            <span v-if="!loggedIn"></span>
            <v-icon class="delete" v-else-if="comment.commentOwnerId == currentUser.uid" v-on:click="removeComment(comment.id)">delete</v-icon>
          </h4>
          <div v-bind:style="{wordWrap:'break-word'}">{{comment.comment}}</div>
        </div>
      </div>
    </div>
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
      errorMsg: '',
      userVote: 0
		}
	},
  created(){
      db.ref(`boxes`).on('value', (snapshot) => {
      let data = snapshot.val();
      let list = [];
      for(let key in data){
        let loopedData = data[key];
        for(let key in loopedData){
          loopedData[key].id = key;
          list.push(loopedData[key]);
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
    },
    allVotes(){
      let voteCount = 0;
      this.filteredBoxes.forEach((item) => {
        for(let key in item.votes){
          if(this.loggedIn !== false && key === this.currentUser.uid){
            this.userVote = item.votes[key].vote;
          }
          voteCount += item.votes[key].vote;
        }
      });
      return voteCount;
    }
  },
  methods: {
    postComment(){
      this.errorMsg = '';
      if(this.loggedIn){
        if(this.comment !== ''){
          db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}`)
          .push({comment: this.comment, commentOwnerId: this.currentUser.uid, commentOwnerName: this.currentUser.displayName})
          .then((data) => {
            this.comment = '';
            db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}`)
            .child(data.key).update({id: data.key});
          })
        } else {
          this.errorMsg = 'Write a comment to post';
        }
      } else {
        this.errorMsg = 'You need to sign in to post a comment';
        this.comment = '';
      }
    },

    removeComment(id){
      db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/comments/${this.currentUser.uid}/${id}`)
      .remove();
    },

    upVote(){
      this.errorMsg = '';
      if(this.loggedIn){
        let myVote = this.userVote === 1 ? 0 : 1;
        db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/votes/${this.currentUser.uid}`)
        .update({vote: myVote});
      } else {
        this.errorMsg = 'You need to sign in to vote';
      }
    },

    downVote(){
      this.errorMsg = '';
      if(this.loggedIn){
        let myVote = this.userVote === -1 ? 0 : -1;
        db.ref(`boxes/${this.filteredBoxes[0].owner}/${this.filteredBoxes[0].id}/votes/${this.currentUser.uid}`)
        .update({vote: myVote});
      } else {
        this.errorMsg = 'You need to sign in to vote';
      }
    }
  }
}
</script>

<style lang="scss">
  
  .infoWrapper {
    height: 100%;
    background-color: #EDECED;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .infoContainer {
    width: 620px;
    padding: 10px 30px;
    background-color: white;
    box-shadow: 2px 2px 8px #303030;
    margin: 10px 0px 10px 0px;
    img {
      width: 560px;
      height: 450px;
    }
  }

  .voteContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .commentContainer {
    border-bottom: 0.5px solid #bababa;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }

  .commentInput {
    color: black !important;
  }

  .primary--text textarea {
    caret-color: black !important;
  }

  .thumb {
    cursor: pointer;
  }

  .upvoted {
    color: limegreen !important;
  }

  .downvoted {
    color: red !important;
  }
</style>