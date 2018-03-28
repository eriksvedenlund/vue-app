<template>
	<div v-if="totalPages() > 0" class="pagination-wrapper">
		<span v-if="showPreviousLink()" class="pagination-btn" v-on:click="updatePage(currentPage - 1)">
			<v-icon>keyboard_arrow_left</v-icon>
		</span>
		<h3>{{ currentPage + 1 }} / {{ totalPages() }}</h3>
		<span v-if="showNextLink()" class="pagination-btn" v-on:click="updatePage(currentPage + 1)">
			<v-icon>keyboard_arrow_right</v-icon>
		</span>
	</div>
</template>

<script>
	export default {
		name: 'pagination',
		props: ['boxes', 'currentPage', 'pageSize'],
		methods: {
			updatePage(pageNumber){
				this.$emit('page:update', pageNumber);
			},
			totalPages(){
				return Math.ceil(this.boxes.length / this.pageSize); 
			},
			showPreviousLink(){
				return this.currentPage == 0 ? false : true;
			},
			showNextLink(){
				return this.currentPage == (this.totalPages() - 1) ? false : true;
			}
		}
	}
</script>

<style lang="scss">
	.pagination-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10px 0px 20px 0px;
	}

	.pagination-btn {
		cursor: pointer;

		i {
			font-size: 30px;
    	color: #424242 !important;
		}
	}
</style>