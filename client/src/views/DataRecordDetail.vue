<template>
  <!-- <div class="DataRecordDetail"> -->
    <v-container class="DataRecordDetail" v-if="lookupsReady">
      <v-row>
        <v-col cols=4>
          <v-card>
            <v-card-title>
              {{dataRecordWithDetails.description}}
            </v-card-title>
            <v-card-subtitle>
              <tags-list-cell
                :tagNames="dataRecordWithDetails.tags.map(x=>x.name)"
                :primaryTagName="dataRecordWithDetails.primary_tag"
              />
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
                :quantity="primaryElementQuantity"
                />
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col>
          <v-card>
            <v-card-title>
              {{dataRecordWithDetails.gw2_account_name}}
            </v-card-title>
            <v-card-subtitle>
              {{dataRecordWithDetails.end_time.toLocaleString()}}
            </v-card-subtitle>

            <!-- <v-card-text>
              No Line Edits
            </v-card-text> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <data-record-form-button
                :dataRecord="dataRecordWithDetails"
                editForm
                @edit="onEdit"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>



      <v-row>
        <v-col>
          <DataRecordLinesTable
            :dataRecordLinesWithElementDetails="dataRecordLinesWithElementDetails"
            :description="dataRecordWithDetails.description"
            :endTime="dataRecordWithDetails.end_time"
          />
        </v-col>
      </v-row>

    </v-container>

  <!-- </div> -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Item from '../components/Item.vue'
import DataRecordLinesTable from '../components/tables/DataRecordLinesTable.vue'
import DataRecordFormButton from '../components/SaveNewDataRecord/DataRecordFormButton.vue'
import TagsListCell from '../components/dataRecordViewer/TagsListCell.vue'

export default {
  name: 'DataRecordDetail',
  components: { 
    Item ,
    DataRecordLinesTable,
    DataRecordFormButton,
    TagsListCell,
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
    onEdit() {
      this.fetchDataRecordWithDetails(this.$route.params.record_id)
    }
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
    primaryElementQuantity() {
      let quantity = 0
      this.dataRecordWithDetails.lines.forEach(line => {
        if (line.element_id === this.dataRecordWithDetails.primary_element_id
          && line.element_type === this.dataRecordWithDetails.primary_element_type) {
            quantity += line.quantity
          }
      })
      return quantity
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