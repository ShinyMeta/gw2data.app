<template>
  <div class="DataRecordList">
    <v-text-field
      v-model="search"
      label="Search"
      class="mx-4"
    ></v-text-field>
    <v-data-table
      v-if="lookupsReady"
      class="mx-12"
      :headers="headers"
      :items="dataRecordsWithElementDetails"
      :items-per-page="50"
      :footer-props="{
          itemsPerPageOptions:[25,50,100,-1]
        }"
      :search="search"
    >

      <template v-slot:[`item.icon`]="{item}" >
        <item v-if="item.primary_element_type==='Item'"
          :imageUrl="itemLookup[item.primary_element_id].icon"
          :name="itemLookup[item.primary_element_id].name"
          :id="item.primary_element_id"
          :description="itemLookup[item.primary_element_id].description"
          :showPosNeg="false"
          />
        <item v-if="item.primary_element_type==='Currency'"
          :imageUrl="currencyLookup[item.primary_element_id].icon"
          :name="currencyLookup[item.primary_element_id].name"
          :id="item.primary_element_id"
          :description="currencyLookup[item.primary_element_id].description"
          :showPosNeg="false"
          />
      </template>    

      <template v-slot:[`item.description`]="{item, value}">
        <router-link :to="`/DataRecordDetail/${item.id}`">
          {{value}}
        </router-link>
      </template>


    </v-data-table>
    
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Item from '../components/Item.vue'

export default {
  name: 'DataRecordList',
  components: { Item },
  data() {
    return {
      lookupsReady: false,
      search: '',

      dataRecordSearchString:"",
      headers: [
        { text: 'Description', value: 'description' },
        {
          text: 'Icon', 
          value: 'icon', 
          sortable: false,
          width: "64px"
        }, 
        { text: 'ID', value: 'primary_element_id', width:"96px" }, 
        { text: 'Primary Element Name', value: 'name', width:"200px"  }, 
        // {text: 'Details', value: 'details'},
        { text: 'Primary Tag', value: 'primary_tag' },
        // {text: 'Start Time', value: 'start_time'},
        { text: 'Date', value: 'end_time' },
        // {text: 'Status', value: 'status'},
      ]
    }
  },
  methods: {
    ...mapActions([
      'fetchDataRecords',
      'addItemsToLookupFromApi',
      'loadCurrencyLookupFromApi',
    ])
  },
  computed:{
    ...mapGetters([
      'dataRecords',
      'currencyLookup',
      'itemLookup',
    ]),
    dataRecordsWithElementDetails(){
      const result = [...this.dataRecords]
      result.forEach(x => {
        if (x.primary_element_type === "Item") {
          if (this.itemLookup[x.primary_element_id]){
            x.name = this.itemLookup[x.primary_element_id].name
            x.icon = this.itemLookup[x.primary_element_id].icon 
          }
          else {
            x.name = 'Loading...'
          }
        }
        if (x.primary_element_type === "Currency") {
          if (this.currencyLookup[x.primary_element_id]){
            x.name = this.currencyLookup[x.primary_element_id].name 
            x.icon = this.currencyLookup[x.primary_element_id].icon 
          }
          else {
            x.name = 'Loading...'
          }
        }
      })
      return result
    }
  },
  created() {
    const dataRecordsAndItemsPromise =  this.fetchDataRecords()
      .then(() => {
        const idsToFetch = this.dataRecords
          .filter(x => x.primary_element_type === 'Item')
          .map(x => x.primary_element_id)
        return this.addItemsToLookupFromApi(idsToFetch)
      })
      .then(() => {
        //add the name and icon to the dataRecords
      })

    const currencyPromise = this.loadCurrencyLookupFromApi()

    return Promise.all([
      dataRecordsAndItemsPromise,
      currencyPromise,
    ])
    .then(() => {
      this.lookupsReady = true
    })
  }
}
</script>

<style>

</style>