<template>
  <div class="DataRecordDetail">
    <v-container class="ma-12" v-if="lookupsReady">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              {{dataRecordWithDetails.description}}
            </v-card-title>
            <v-card-subtitle>
              {{dataRecordWithDetails.primary_tag}}
            </v-card-subtitle>
            <v-card-text>
              {{dataRecordWithDetails.details}}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>
              {{primaryElementDetails.name}}
            </v-card-title>
            <v-card-subtitle>
              {{dataRecordWithDetails.primary_element_type}} ID: {{dataRecordWithDetails.primary_element_id}}
            </v-card-subtitle>

            <v-card-text>
              <item 
                :imageUrl="primaryElementDetails.icon"
                :name="primaryElementDetails.name"
                :id="dataRecordWithDetails.primary_element_id"
                :description="primaryElementDetails.description"
                :showPosNeg="false"
                />
            </v-card-text>
          </v-card>
        </v-col><v-col>
          <v-card>
            <v-card-title>
              {{dataRecordWithDetails.gw2_account_name}}
            </v-card-title>
            <v-card-subtitle>
              {{dataRecordWithDetails.end_time.toLocaleString()}}
            </v-card-subtitle>

            <v-card-text>
              No Line Edits
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>



      <v-row>
        <v-col>
          <DataRecordTable
            :dataRecordLinesWithElementDetails="dataRecordLinesWithElementDetails"
            :description="dataRecordWithDetails.description"
            :endTime="dataRecordWithDetails.end_time"
          />
        </v-col>
      </v-row>


      <!-- <v-container v-if="lookupsReady" >
        <v-row>
          <v-col cols=3>
            Description:
          </v-col>
          <v-col cols=3>
            {{dataRecordWithDetails.description}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols=3>
            Primary Element:
          </v-col>
          <v-col cols=1>
            <item 
              :imageUrl="primaryElementDetails.icon"
              :name="primaryElementDetails.name"
              :id="dataRecordWithDetails.primary_element_id"
              :description="primaryElementDetails.description"
              :showPosNeg="false"
              />
          </v-col>
          <v-col  cols=2 justify-self="left" align-self="center">
            {{primaryElementDetails.name}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols=3>
            {{dataRecordWithDetails.start_time}} - {{dataRecordWithDetails.end_time}}
          </v-col>
        </v-row>
      </v-container> -->

    </v-container>
    <!-- 
      Description           Primary Element             Start Time-End Time
      Details               Primary Tag                      GW2 Account Name
      ...                   ...Tags                             Status
      LINES
      ...
      ...
     -->

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Item from '../components/Item.vue'
import DataRecordTable from '../components/dataRecordViewer/DataRecordTable.vue'

export default {
  name: 'DataRecordDetail',
  components: { 
    Item ,
    DataRecordTable,
  },
  data() {
    return {
      lookupsReady: false,
    }
  },
  methods: {
    ...mapActions([
      'fetchDataRecordWithDetails',
      'addItemsToLookupFromApi',
      'loadCurrencyLookupFromApi',
    ]),
  },
  computed:{
    ...mapGetters([
      'dataRecordWithDetails',
      'currencyLookup',
      'itemLookup',
      'lookupElementDetails',
    ]),
    primaryElementDetails(){
      return this.lookupElementDetails({
        type: this.dataRecordWithDetails.primary_element_type,
        id: this.dataRecordWithDetails.primary_element_id,
      })
    },
    dataRecordLinesWithElementDetails(){
      const result = [...this.dataRecordWithDetails.lines]
      result.forEach(x => {
        if (x.element_type === "Item") {
          if (this.itemLookup[x.element_id]){
            x.name = this.itemLookup[x.element_id].name
            x.icon = this.itemLookup[x.element_id].icon 
            x.type = this.itemLookup[x.element_id].type 
          }
          else {
            x.name = 'Loading...'
          }
        }
        if (x.element_type === "Currency") {
          if (this.currencyLookup[x.element_id]){
            x.name = this.currencyLookup[x.element_id].name 
            x.icon = this.currencyLookup[x.element_id].icon 
            x.type = "Currency"
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
    return this.fetchDataRecordWithDetails(this.$route.params.record_id)
      .then(() => { 
        // const idsToFetcharray = this.dataRecordWithDetails.lines
        //   .filter(x => x.element_type === 'Item')
        //   .map(x => x.element_id)
        const idsToFetch = new Set()

        this.dataRecordWithDetails.lines
          .filter(x => x.element_type === 'Item').forEach((item) => {
            idsToFetch.add(item.element_id)
            if (item.upgrades) {
              item.upgrades.split(',').forEach(x => idsToFetch.add(x))
            }
          })

        return Promise.all([
          this.addItemsToLookupFromApi(Array.from(idsToFetch)),
          this.loadCurrencyLookupFromApi()
        ])
      })
      .then(() => {
        this.lookupsReady = true
      })
  }
}
</script>

<style>


</style>