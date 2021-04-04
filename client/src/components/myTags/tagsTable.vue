<template>
  <v-container>

    <v-row >
      <v-col>
        <v-text-field
          v-model="search"
          label="Search"
        ></v-text-field>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="tags"
          :search="search"
          :items-per-page="50"
          :footer-props="{
              itemsPerPageOptions:[25,50,100,-1]
            }"
        >
          <template v-slot:[`item.name`]="{value}">
            <v-chip>
              {{value}}
            </v-chip>
          </template> 

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon 
              v-if="item.primaryCount===0"
              @click="deleteTag(item)" 
              
              small 
            > 
              mdi-delete </v-icon>
          </template>

        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

export default {
  name: 'TagsTable',
  components: {
    // MyDataRecordsTableRow
  },
  props: {
    tags: Array,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Tag Name', value: 'name' }, 
        { text: '# Records with this tag', value: 'count'},
        { text: '# with this tag as Primary', value: 'primaryCount'},
        { text: 'Actions', value: 'actions'},
        // { text: 'Date', value: 'end_time', groupable: false },
      ],
    }
  },
  computed: {

  },
  methods: {
    deleteTag(tag) {
      this.$axios.delete('/api/dataRecord/tag', {data: {name: tag.name}})
        .then(() => {
          this.$emit('deletedTag', tag)
        })
        .catch((err) => {
          console.log(err.response.message)
        })
    }
  }
}


</script>

<style>

</style>