<template>
  <div class="wrapper">
    <div class="inputContainer">
    	<label>Title</label>
    	<input type="text" v-model="title" />
      <input type="file" accept="image/*" v-on:change="pickFile" ref="fileInput" />
    	<v-btn color="primary" v-on:click="send">Send</v-btn>
      <div>{{sendError}}</div>
    </div>
    <div class="boxContainer">
    	<div v-for="box in boxes" class="box">
    		<router-link v-bind:to="'/info/' + box.id">{{box.title}}</router-link>
        <img v-bind:src="box.imageUrl">
        <div v-if="loggedIn === false"></div>
    		<v-btn color="primary" v-else-if="box.owner == currentUser.uid" v-on:click="remove(box.id)">Delete</v-btn>
    	</div>
    </div>
  </div>
</template>

<script>
import { boxesRef, db, storage } from '../firebaseConfig';

export default {
  props: ['currentUser', 'loggedIn'],
  data () {
    return {
      title: '',
      boxes: [],
      sendError: '',
      image: null
    }
  },
  name: 'Home',
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
      console.log(this.boxes);
		});
  },
  // firebase: {
  // 	boxes: db.ref(`boxes`)
  // },
  methods: {
  	send: function(){
      this.sendError = '';
      if(this.loggedIn === false){
        this.sendError = 'You need to sign in to post';
        this.title = '';
      } else {
        let imageUrl;
        let key;
    		db.ref(`boxes/${this.currentUser.uid}`).push({title: this.title, owner: this.currentUser.uid})
          .then((data) => {
            key = data.key;
            return key;
          })
          .then((key) => {
            const filename = this.image.name;
            const ext = filename.slice(filename.lastIndexOf('.'));
            this.$refs.fileInput.value = '';  
            return storage.ref('images/' + key + '.' + ext).put(this.image);
          })
          .then((fileData) => {
            imageUrl = fileData.metadata.downloadURLs[0];
            db.ref(`boxes/${this.currentUser.uid}`).child(key).update({imageUrl: imageUrl});
          })
          .catch((error) => {
            this.sendError = 'Something went wrong';
          })
    		this.title = '';
      }
  	},

  	remove: function(id){
  		db.ref(`boxes/${this.currentUser.uid}/${id}`).remove();
  	},

    pickFile: function(event){
      this.image = event.target.files[0];
    }
  }
}
</script>

<style lang="scss">
  .wrapper {
    height: 100%;
  }

  .inputContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .boxContainer {
    // height: 100vh;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .box {
    width: 200px;
    height: 200px;
    border: 1px solid black;
    margin: 5px;

    img {
      width: 100px;
      height: 100px;
    }
  }  
</style>