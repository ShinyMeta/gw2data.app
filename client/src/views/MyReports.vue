<template>
  <div class="DataRecordList">
    <summary-report-config-form-button
      newForm
    />

    <v-container>
      <v-row>
        <v-col>
          <summary-report-table 
            v-if="lookupsReady"
            :summaryReports="summaryReports"
          />
        </v-col>
      </v-row>
    </v-container>

    
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import TagsListCell from '../components/dataRecordViewer/TagsListCell.vue'
// import Item from '../components/Item.vue'
import SummaryReportConfigFormButton from '../components/dialogButtons/SummaryReportConfigFormButton.vue'
import SummaryReportTable from '../components/tables/SummaryReportTable.vue'

export default {
  name: 'MyReports',
  components: { 
    // Item, 
    // TagsListCell,
    SummaryReportConfigFormButton,
    SummaryReportTable,
    },
  data() {
    return {
      lookupsReady: false,
     

      summaryReports: [],

    }
  },
  methods: {
    ...mapActions([
      // 'fetchDataRecords',
      'addItemsToLookupFromApi',
      'loadCurrencyLookupFromApi',
    ])
  },
  computed:{
    ...mapGetters([
      'currencyLookup',
      'itemLookup',
      'elementLookup',
    ]),

  },
  created() {
    const myReportsAndItemsPromise =  this.$axios.get('/api/report/summaryReport/list')
      .then(({data}) => {
        this.summaryReports = data.reports
        const idsToFetch = this.summaryReports
          .filter(x => x.element_type === 'Item')
          .map(x => x.element_id)
        return this.addItemsToLookupFromApi(idsToFetch)
      })
      .then(() => {
        this.lookupsReady = true
      })

    const currencyPromise = this.loadCurrencyLookupFromApi()

    return Promise.all([
      myReportsAndItemsPromise,
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