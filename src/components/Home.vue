<template>
  <div>
  	<label>Title</label>
  	<input type="text" v-model="title" />
  	<v-btn color="primary" v-on:click="send">Send</v-btn>
  	<div v-for="box in boxes">
  		{{box.title}}
  		<div v-if="loggedIn === false"></div>
  		<v-btn color="primary" v-else-if="box.owner == currentUser.uid" v-on:click="remove(box.id)">Delete</v-btn>
  	</div>
  </div>
</template>

<script>
import { boxesRef, db } from '../firebaseConfig';

export default {
  props: ['currentUser', 'loggedIn'],
  data () {
    return {
      title: '',
      boxes: []
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
		});
  },
  // firebase: {
  // 	boxes: db.ref(`boxes`)
  // },
  methods: {
  	send: function(){
  		db.ref(`boxes/${this.currentUser.uid}`).push({title: this.title, owner: this.currentUser.uid});
  		this.title = '';
  	},

  	remove: function(id){
  		db.ref(`boxes/${this.currentUser.uid}/${id}`).remove();
  	}
  }
}
</script>
