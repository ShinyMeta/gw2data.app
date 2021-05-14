<template>
  <v-container>

    <v-row >
      <v-col>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
      </v-col>
      <!-- <v-col class="d-flex justify-center">
        <v-btn @click="downloadCsv">Download CSV</v-btn>
      </v-col> -->
    </v-row>


    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="summaryReports"
          :search="search"
          :items-per-page="50"
          :footer-props="{
            itemsPerPageOptions:[25,50,100,-1]
          }"
        >

          <template v-slot:[`item.icon`]="{item}" >
            <item 
              :imageUrl="elementLookup[item.element_type][item.element_id].icon"
              :name="elementLookup[item.element_type][item.element_id].name"
              />
          </template>  

          <template v-slot:[`item.name`]="{item, value}">
            <router-link :to="`/ViewSummaryReport/${item.id}`">
              {{value}}
            </router-link>
          </template>

          <template v-slot:[`item.tags`]="{item}" >
            <tags-list-cell
              :tagNames="item.tags"
              :primaryTagName="item.primary_tag"
            />
          </template> 

        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TagsListCell from '../dataRecordViewer/TagsListCell.vue'
import Item from '../Item.vue'
export default {
  name:'SummaryReportTable',
  components: {
    TagsListCell,
    Item,

  },
  props: {
    summaryReports: Array
  },
  data() {
    return {
      search: '',
      headers: [ 
        { text: 'Icon', value: 'icon', groupable: false },
        { text: 'Name', value: 'name', groupable: false }, 
        { text: 'Tags', value: 'tags', groupable: false },
        // { text: 'Date', value: 'end_time', groupable: false },
        // { text: 'ID', value: 'element_id', width:"96px", groupable: false }, 
      ],

    }
  },
  computed:{
    ...mapGetters([
      'elementLookup'
    ])
  }

}
</script>

<style>

</style>