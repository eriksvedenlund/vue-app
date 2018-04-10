<template>
  <div class="wrapper">
    <div class="inputContainer">
      <v-text-field label="Title" v-bind:style="{width: '20%', color: 'black !important', marginBottom: '-5px'}" v-model="title" class="titleInput" maxlength="12"></v-text-field>
      <input id="file" type="file" accept="image/*" v-on:change="pickFile" ref="fileInput" />
      <div>
        <v-btn v-on:click="triggerFile">{{labelMsg}}</v-btn>
    	  <v-btn color="primary" v-on:click="send">post</v-btn>
      </div>
      <div>{{sendError}}</div>
    </div>
    <div class="boxContainer">
    	<div v-for="(box, index) in visibleBoxes" class="box" v-bind:visibleBoxes="visibleBoxes" v-bind:currentPage="currentPage">
        <div class="loaderContainer" v-if="index == 0 && loading">
          <v-progress-circular :size="80" indeterminate color="primary"></v-progress-circular>
        </div>
        <router-link v-else v-bind:to="'/info/' + box.id"><img v-bind:src="box.imageUrl"></router-link>
        <div class="bottomBox">
          <router-link v-bind:to="'/info/' + box.id"><h3>{{box.title}}</h3></router-link>
          <small>{{box.time}}</small>
          <div class="infoBox">
            <div><v-icon>thumb_up</v-icon><span v-bind:style="{marginLeft: '4px'}">{{box.votes | total}}</span></div>
            <div><v-icon>mode_comment</v-icon><span v-bind:style="{marginLeft: '4px'}">{{box.comments | totalComments}}</span></div>
            <span v-if="!loggedIn"></span>
        		<v-icon class="delete" v-else-if="box.owner == currentUser.uid" v-on:click="remove(box.id, box.storagePath)">delete</v-icon>
          </div>
        </div>
    	</div>
    </div>
      <pagination
        v-bind:boxes="boxes"
        v-on:page:update="updatePage"
        v-bind:currentPage="currentPage"
        v-bind:pageSize="pageSize">
      </pagination>
  </div>
</template>

<script>
import { boxesRef, db, storage } from '../firebaseConfig';
import moment from 'moment';
import Pagination from './Pagination';

export default {
  props: ['currentUser', 'loggedIn'],
  data () {
    return {
      title: '',
      boxes: [],
      sendError: '',
      image: null,
      labelMsg: 'Choose an image',
      loading: false,
      currentPage: 0,
      pageSize: 6,
      visibleBoxes: []
    }
  },
  name: 'Home',
  components: {
    'pagination': Pagination
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
      this.updateVisibleBoxes();
    });
  },
  filters: {
    total(votes){
      let list = [];
      for(let key in votes){
        list.push(votes[key]); 
      }
      return list.map((item) => item.vote).reduce((total, item) => {
          return total + item}, 0);
    },
    totalComments(comments){
      let list = [];
      for(let key in comments){
        list.push(comments[key]);
      }
      return list.length;
    }
  },
  methods: {
  	send(){
      this.sendError = '';
      if(this.loggedIn){
        let imageUrl;
        let key;
        let storagePath;
        if(this.title === '' || this.image === null){
          this.sendError = 'Fill out title and image to post';
        } else {
          let fileType = this.image.type;
          fileType = fileType.slice(0, fileType.lastIndexOf('/'));
          if(fileType !== 'image'){
            this.sendError = 'Please select a valid image';
            this.image = null;
            this.labelMsg = 'Choose an image';
          } else {
            this.loading = true;
            let time = moment().format('YY/MM/DD HH:mm');
        		db.ref('boxes/').push({title: this.title, owner: this.currentUser.uid, displayName: this.currentUser.displayName, time: time})
              .then((data) => {
                key = data.key;
                return key;
              })
              .then((key) => {
                const filename = this.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                this.labelMsg = 'Choose an image';  
                return storage.ref('images/' + key + ext).put(this.image);
              })
              .then((fileData) => {
                this.image = null;
                imageUrl = fileData.metadata.downloadURLs[0];
                storagePath = fileData.metadata.fullPath;
                db.ref('boxes/').child(key).update({imageUrl: imageUrl, storagePath: storagePath});
              })
              .then(() => {
                this.loading = false;
              })
              .catch((error) => {
                this.sendError = 'Something went wrong';
              })
        		this.title = '';
          }
        }
      } else {
        this.sendError = 'You need to sign in to post';
        this.title = '';
        this.image = null;
        this.labelMsg = 'Choose an image';
      }
    },

  	remove(id, storagePath){
      storage.ref(storagePath).delete();
  		db.ref(`boxes/${id}`).remove();
  	},

    triggerFile(){
      this.$refs.fileInput.click();
    },

    pickFile(event){
      if(event.target.files[0] !== undefined){
        this.image = event.target.files[0];
        this.labelMsg = this.image.name;
      } else {
        this.image = null;
        this.labelMsg = 'Choose an image';
      }
    },

    updateVisibleBoxes(){
      this.visibleBoxes = this.boxes.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)

      if(this.visibleBoxes.length == 0 && this.currentPage > 0){
        this.updatePage(this.currentPage - 1);
      }
    },

    updatePage(pageNumber){
      this.currentPage = pageNumber;
      this.updateVisibleBoxes();
    }
  }
}
</script>

<style lang="scss">

  .wrapper {
    height: 100%;
    background-color: #EDECED;
  }

  .inputContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  #file {
    display: none;
  }

  .primary--text input {
    caret-color: black !important;
  }

  .boxContainer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px 30px 10px 30px;
  }

  .box {
    width: 376px;
    height: 310px;
    margin: 5px;
    padding: 5px;
    background-color: white;
    box-shadow: 2px 2px 8px #303030;

    img {
      width: 100%;
      height: 90%;
      object-fit: cover;
    }
  }

  .loaderContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 90%;
  }

  .bottomBox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin-left: 8px;
    }
  }

  .infoBox {
    display: flex;
    align-items: center;

    i {
      color: #424242 !important;
    }

    div {
      margin-right: 12px;
      cursor: default;
    }
  }

  .delete {
    cursor: pointer;
    color: #424242 !important;
  } 

  @media screen and (max-width: 900px) {
    .boxContainer {
      padding: 0;
    }

    .titleInput {
      width: 35% !important;
    }
  }

  @media screen and (max-width: 470px) {
    .box {
      width: 280px;
      height: 226px;

      img {
        height: 88%;
      }
    }

    .titleInput {
      width: 50% !important;
    }

    .infoBox {
      i {
        font-size: 21px !important;
      }

      div {
        margin-right: 0px;
      }
    }

    .bottomBox {
      h3 {
        margin-left: 0px;
        font-size: 1.0em;
      }
    }
  }

</style>