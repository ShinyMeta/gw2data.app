<template>
  <v-container>
    <v-row>
      <v-col>
        <tags-table
        :tags="tags"
        @deletedTag="deletedTag"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import tagsTable from '../components/myTags/tagsTable.vue'
export default {
  components: { tagsTable },
  name: 'MyTags',
  props: {

  },
  data() {
    return {
      tags: [ ]
    }
  },

  methods:{
    deletedTag(tag) {
      const index = this.tags.findIndex(x=>x.name===tag.name);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  },

  created() {
    this.$axios.get('/api/dataRecord/myTags')
      .then(({data}) => {
        this.tags = data.tags
      })
  }

}
</script>

<style>

</style>