<template>
  <div class="DataRecordList">

    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
            height=42
            clearable
          ></v-text-field>
        </v-col>
        <v-col>
          <tag-selector
            v-model="searchTags"
            clearable
          />
        </v-col>
        <v-col cols=2>
          <v-menu
            v-model="dateSearchStartMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateSearchStart"
                label="Search dates after:"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateSearchStart"
              @input="dateSearchStartMenu = false"
              show-current
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols=2>
          <v-menu
            v-model="dateSearchEndMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateSearchEnd"
                label="Search dates before:"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateSearchEnd"
              @input="dateSearchEndMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            v-if="lookupsReady"
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

            <template v-slot:[`item.tags`]="{item}" >
              <tags-list-cell
                :tagNames="item.tags"
                :primaryTagName="item.primary_tag"
              />
            </template>  

            <template v-slot:[`item.end_time`]="{value}">
              {{new Intl.DateTimeFormat("en-US",{dateStyle: "medium",timeStyle: "short"})
                .format(Date.parse(value))}}
            </template>


          </v-data-table>

        </v-col>
      </v-row>
    </v-container>

    
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TagsListCell from '../components/dataRecordViewer/TagsListCell.vue'
import Item from '../components/Item.vue'
import TagSelector from '../components/SaveNewDataRecord/TagSelector.vue'

export default {
  name: 'DataRecordList',
  components: { 
    Item, 
    TagsListCell,
    TagSelector 
    },
  data() {
    return {
      lookupsReady: false,
      search: '',
      searchTags: [],

      dateSearchStartMenu: false,
      dateSearchEndMenu: false,
      dateSearchStart: null,
      dateSearchEnd: null,

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
        // { text: 'Primary Tag', value: 'primary_tag' },
        { text: 'Tags', value: 'tags',
          filter: (tags) => {
            for(const searchTag of this.searchTags) {

              if (!tags.includes(searchTag.name)) {
                return false
              }
            }
            // this.searchTags.forEach(searchTag => {
            // })
            return true
          }
        },
        // {text: 'Start Time', value: 'start_time'},
        { text: 'Date', value: 'end_time', width:"180px",
          filter: (date) => {
            if (this.dateSearchStart && date < this.dateSearchStart) return false
            if (this.dateSearchEnd && date > this.dateSearchEnd) return false
            return true
          }
        },
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