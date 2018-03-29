<template>
  <div class="infoWrapper">
    <div class="infoContainer">
      <div class="flexContainer">
        <h2>{{filteredBoxes[0].title}}</h2>
        <small>{{filteredBoxes[0].time}}</small>
      </div>
      <div class="flexContainer">
        <div>{{filteredBoxes[0].displayName}}</div>
        <div>
          <v-icon v-bind:class="{upvoted : userVote > 0}" class="thumb" v-on:click="upVote">thumb_up</v-icon>  
          <span>{{allVotes}}</span>
          <v-icon v-bind:class="{downvoted : userVote < 0}" class="thumb" v-on:click="downVote">thumb_down</v-icon>
        </div>
      </div>
      <p v-bind:style="{textAlign:'center'}">{{errorVote}}</p>
      <img v-bind:src="filteredBoxes[0].imageUrl">
      <v-text-field
        class="commentInput"
        v-model="comment"
        label="Comment"
        multi-line
        :no-resize="true"
        append-icon="send"
        :append-icon-cb="postComment"
        rows="1">
      </v-text-field>
      <p v-bind:style="{textAlign:'center'}">{{errorMsg}}</p>
      <div v-for="comment in visibleComments" class="commentContainer">
        <div class="flexContainer">
          <h4>{{comment.commentOwnerName}}</h4>
          <div>
            <small>{{comment.time}}</small>
            <span v-if="!loggedIn"></span>
            <v-icon class="delete" v-else-if="comment.commentOwnerId == currentUser.uid" v-on:click="removeComment(comment.id)">delete</v-icon>
          </div>
        </div>
        <div v-bind:style="{wordWrap:'break-word'}">{{comment.comment}}</div>
      </div>
      <comment-pagination
        v-bind:reversedComments="reversedComments"
        v-on:page:update="updatePage"
        v-bind:currentPage="currentPage"
        v-bind:pageSize="pageSize">
      </comment-pagination>
    </div>
  </div>
</template>

<script>
import { boxesRef, db } from '../firebaseConfig';
import moment from 'moment';
import CommentPagination from './CommentPagination';

export default {
  props: ['id', 'currentUser', 'loggedIn'],
	name: 'Info',
  components: {
    'comment-pagination': CommentPagination
  },
	data(){
		return {
      boxes: [],
      comment: '',
      errorMsg: '',
      errorVote: '',
      userVote: 0,
      currentPage: 0,
      pageSize: 6,
      visibleComments: []
		}
	},
  created(){
      db.ref(`boxes`).on('value', (snapshot) => {
      let data = snapshot.val();
      let list = [];
      for(let key in data){
        data[key].id = key;
        list.unshift(data[key]);
      }
      this.boxes = list;
      this.updateVisibleComments();
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
    },
    reversedComments(){
      let list = [];
      for(let key in this.filteredBoxes[0].comments){
        list.unshift(this.filteredBoxes[0].comments[key]);
      }
      return list;
    }
  },
  methods: {
    postComment(){
      this.errorMsg = '';
      if(this.loggedIn){
        if(this.comment !== ''){
          let time = moment().format('DD/MM/YY HH:mm');
          db.ref(`boxes/${this.filteredBoxes[0].id}/comments/`)
          .push({comment: this.comment, commentOwnerId: this.currentUser.uid, commentOwnerName: this.currentUser.displayName, time: time})
          .then((data) => {
            this.comment = '';
            db.ref(`boxes/${this.filteredBoxes[0].id}/comments/`)
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
      db.ref(`boxes/${this.filteredBoxes[0].id}/comments/${id}`)
      .remove();
    },

    upVote(){
      this.errorVote = '';
      if(this.loggedIn){
        let myVote = this.userVote === 1 ? 0 : 1;
        db.ref(`boxes/${this.filteredBoxes[0].id}/votes/${this.currentUser.uid}`)
        .update({vote: myVote});
      } else {
        this.errorVote = 'You need to sign in to vote';
      }
    },

    downVote(){
      this.errorVote = '';
      if(this.loggedIn){
        let myVote = this.userVote === -1 ? 0 : -1;
        db.ref(`boxes/${this.filteredBoxes[0].id}/votes/${this.currentUser.uid}`)
        .update({vote: myVote});
      } else {
        this.errorVote = 'You need to sign in to vote';
      }
    },

    updateVisibleComments(){
      this.visibleComments = this.reversedComments.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)

      if(this.visibleComments.length == 0 && this.currentPage > 0){
        this.updatePage(this.currentPage - 1);
      }
    },

    updatePage(pageNumber){
      this.currentPage = pageNumber;
      this.updateVisibleComments();
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

  .flexContainer {
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