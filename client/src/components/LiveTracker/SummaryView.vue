<template>
  <DataRecordLinesTable
    :dataRecordLinesWithElementDetails="dataRecordLinesWithElementDetails"
    description="liveFeed"
    :endTime="endTime"
  />
</template>

<script>
import DataRecordLinesTable from "../tables/DataRecordLinesTable.vue";
export default {
  name: "SummaryView",
  components: {
    DataRecordLinesTable,
  },
  props: {
    dropsFromDrf: Array,
  },
  computed: {
    endTime() {
      return new Date(this.dropsFromDrf.reduce((latestTimeStampSoFar, currentDrop) => {
        return currentDrop.timestamp>latestTimeStampSoFar?
          currentDrop.timestamp:
          latestTimeStampSoFar
      }))
    }
  },
  asyncComputed: {
    dataRecordLinesWithElementDetails: {
      default:[],
      get() {
        const totals = {
          curr:{},
          items:{}
        }
        for (const dropMolecule of this.dropsFromDrf){
          //each Curr
          for (const currId of Object.keys(dropMolecule.curr)) {
            if (!totals.curr[currId]) {
              totals.curr[currId] = 0
            }
            totals.curr[currId] += dropMolecule.curr[currId]
          }
          //each Item
          for (const itemId of Object.keys(dropMolecule.items)) {
            if (!totals.items[itemId]) {
              totals.items[itemId] = 0
            }
            totals.items[itemId] += dropMolecule.items[itemId]
          }
        }

        const resultArray = []
        for (const currId of Object.keys(totals.curr)) {
          if (totals.curr[currId] !==0) {
            let newLine = {}
            this.$gw2api
              .currencies()
              .autoBatch()
              .get(+currId)
              .then((currencyData) => {
                newLine = currencyData;
                newLine.element_type = 'Currency'
                newLine.type = 'Currency'
                newLine.element_id = currId
                newLine.quantity = totals.curr[currId]
                resultArray.push(newLine)
              })
          }
        }

        for (const itemId of Object.keys(totals.items)) {
          if (totals.items[itemId] !==0) {
            let newLine = {}
            this.$gw2api
              .items()
              .autoBatch()
              .get(+itemId)
              .then((itemData) => {
                newLine = itemData;
                newLine.element_type = 'Item'
                newLine.element_id = itemId
                newLine.quantity = totals.items[itemId]
                resultArray.push(newLine)
              })
          }
        }

        return resultArray
      }
    }
  }
};
</script>

<style></style>
