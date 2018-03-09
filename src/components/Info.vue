<template>
  <div>{{filteredBoxes[0].title}}</div>
</template>

<script>
import { boxesRef, db } from '../firebaseConfig';
export default {
  props: ['id'],
	name: 'Info',
	data(){
		return {
      boxes: []
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
    filteredBoxes: function(){
      return this.boxes.filter((item) => {
        return item.id === this.id;
      })
    }
  }
}
</script>