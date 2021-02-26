<template>
  <div class="DataRecordDetail">
    {{dataRecordWithDetails.description}}
    <button @click="downloadCsv">Download CSV</button>
    <div v-for="(line) in dataRecordWithDetails.lines"
      :key="line.id"
      >
        {{line.quantity}} - {{line.element_id}} - {{line.element_type}}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DataRecordDetail',
  methods: {
    ...mapActions([
      'fetchDataRecordWithDetails'
    ]),
    getCSVString(){
      const columnTitles = [
        'element_id',
        'element_type',
        'upgrades',
        'quantity',
      ]
      let csvRows = [columnTitles]
      this.dataRecordWithDetails.lines.forEach((line) => {
        let newCsvRow = []
        columnTitles.forEach(colName => newCsvRow.push(line[colName]))
        csvRows.push(newCsvRow)
      })
      // let result = "data:text/csv;charset=utf-8," 
      //     + csvRows.map(e => e.join(",")).join("\n");
      let result = csvRows.map(e => e.join(",")).join("\n");
      return result
    },
    downloadCsv() {
      const anchor = document.createElement('a');
      anchor.href = "data:text/csv;charset=utf-8," 
          +  encodeURIComponent(this.getCSVString());
      anchor.target = '_blank';
      // const end = new Date(this.dataRecordWithDetails.end_time)
      anchor.download = `${this.dataRecordWithDetails.description}_${this.dataRecordWithDetails.end_time}.csv`;
      anchor.click();
    }
  },
  computed:{
    ...mapGetters([
      'dataRecordWithDetails'
    ])
  },
  created() {
    this.fetchDataRecordWithDetails(this.$route.params.record_id)
  }
}
</script>

<style>


</style>