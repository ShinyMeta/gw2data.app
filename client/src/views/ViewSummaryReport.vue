<template>
  <v-container class="ViewSummaryReport" v-if="lookupsReady">
    
    <v-row>
      <v-col>
        <summary-report-info
          :summaryReport="summaryReport"
        />
      </v-col>
    </v-row>




    <v-row>
      <v-col>    
        <v-tabs
          v-model="reportTab"
          centered
        >
          <v-tab :href="'#report-totals'" >
            Report Totals
          </v-tab>
          <v-tab :href="'#data-records'" >
            Source Data Records
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="reportTab">
          <v-tab-item :value="'report-totals'">
            <DataRecordLinesTable
              :dataRecordLinesWithElementDetails="dataRecordLinesForTable"
              :csvFileName="`${summaryReport.name}-${new Date().toLocaleDateString().replaceAll('/','-')}`"
            />
          </v-tab-item>
          <v-tab-item :value="'data-records'" >
            <data-records-table
              :dataRecords="summaryReport.dataRecords"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>

  </v-container>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SummaryReportInfo from '../components/reports/SummaryReportInfo.vue'
// import Item from '../components/Item.vue'
import DataRecordLinesTable from '../components/tables/DataRecordLinesTable.vue'
import DataRecordsTable from '../components/tables/DataRecordsTable.vue'
// import DataRecordFormButton from '../components/SaveNewDataRecord/DataRecordFormButton.vue'
// import TagsListCell from '../components/dataRecordViewer/TagsListCell.vue'

export default {
  name: 'ViewSummaryReport',
  components: { 
    // Item ,
    DataRecordLinesTable,
    SummaryReportInfo,
    DataRecordsTable,
    // DataRecordFormButton,
    // TagsListCell,
  },
  data() {
    return {
      lookupsReady: false,
      summaryReport: {},
      reportTab: 'report-totals'
    }
  },
  computed:{
    ...mapGetters([
      'dataRecordWithDetails',
      'currencyLookup',
      'itemLookup',
      'lookupElementDetails',
    ]),
    
    dataRecordLinesForTable(){
      if (!this.summaryReport.name || !this.lookupsReady) {
        return []
      }
      // const allLines = [...this.summaryReport.dataRecordLines]
      const collatedLines = {}
      this.summaryReport.dataRecordLines.forEach(line => {
        const key = `${line.element_type}|${line.element_id}|${line.upgrades}`
        if (collatedLines[key]) {
          collatedLines[key].quantity += line.quantity
        }
        else {
          collatedLines[key] = {
            element_id: line.element_id,
            element_type: line.element_type,
            upgrades: line.upgrades,
            quantity: line.quantity,
          }
        }
      })

      let result = []
      Object.keys(collatedLines).forEach(key => {
        result.push(collatedLines[key])
      })

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



  methods: {
    ...mapActions([
      'fetchDataRecordWithDetails',
      'addItemsToLookupFromApi',
      'loadCurrencyLookupFromApi',
    ]),
    // onEdit() {
    //   this.fetchDataRecordWithDetails(this.$route.params.record_id)
    // },
    async fetchReport(reportId) {
      const summaryReport = await this.$axios.get(`/api/report/summaryReport/${reportId}`)
        .then(response => response.data)
      this.summaryReport = summaryReport

      const itemsToLookup = []
      summaryReport.dataRecordLines.forEach(line => {
        if (line.element_type === 'Item') {
          itemsToLookup.push(line.element_id)
          if (line.upgrades) {
            line.upgrades.split(',').forEach(x => {
              itemsToLookup.push(x)
            })
          }
        }
      })
      summaryReport.dataRecords.forEach(dataRecord => {
        dataRecord.tags = JSON.parse(dataRecord.tags)
      })
      if (summaryReport.start_date) {
        summaryReport.start_date = new Date(summaryReport.start_date)
      }
      if (summaryReport.end_date) {
        summaryReport.end_date = new Date(summaryReport.end_date)
      }
      this.lookupsReady = await Promise.all([
        this.addItemsToLookupFromApi(itemsToLookup),
        this.loadCurrencyLookupFromApi()
      ])
      .then(() => true)
    }
  },
  created() {
    return this.fetchReport(this.$route.params.reportId)
    // return this.fetchDataRecordWithDetails(this.$route.params.record_id)
    //   .then(() => { 
    //     // const idsToFetcharray = this.dataRecordWithDetails.lines
    //     //   .filter(x => x.element_type === 'Item')
    //     //   .map(x => x.element_id)
    //     const idsToFetch = new Set()

    //     this.dataRecordWithDetails.lines
    //       .filter(x => x.element_type === 'Item').forEach((item) => {
    //         idsToFetch.add(item.element_id)
    //         if (item.upgrades) {
    //           item.upgrades.split(',').forEach(x => idsToFetch.add(x))
    //         }
    //       })

    //     return Promise.all([
    //       this.addItemsToLookupFromApi(Array.from(idsToFetch)),
    //       this.loadCurrencyLookupFromApi()
    //     ])
    //   })
    //   .then(() => {
    //     this.lookupsReady = true
    //   })
  }
}
</script>

<style>


</style>