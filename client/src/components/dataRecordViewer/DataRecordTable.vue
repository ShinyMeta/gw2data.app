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
      <v-col class="d-flex justify-center">
        <v-btn @click="downloadCsv">Download CSV</v-btn>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-data-table
          class="mx-12"
          :headers="headers"
          :items="dataRecordLinesWithElementDetails"
          :search="search"
          multi-sort
          group-by="element_type"
          group-asc
          show-group-by
          :items-per-page="50"
          :footer-props="{
              itemsPerPageOptions:[25,50,100,-1]
            }"
        >

          <template v-slot:[`item.icon`]="{item}" >
            <item 
              :imageUrl="item.icon"
              :name="item.name"
              :element_id="item.element_id"
              :description="item.description"
              :showPosNeg="false"
              />
          </template>  

          <template v-slot:[`item.upgrades`]="{item}"  >
            <div v-if="item.upgrades" class="d-flex">
              <item
                v-for="(upgradeId,index) in item.upgrades.split(',')"
                :key="`${item.element_id}_upgrade_${index}`"
                :imageUrl="itemLookup[upgradeId].icon"
                :name="itemLookup[upgradeId].name"
                :element_id="upgradeId"
                :description="itemLookup[upgradeId].description"
                :showPosNeg="false"
                />
            </div>
          </template>  

        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import {  mapGetters } from 'vuex'
import Item from '../Item.vue'
// import MyDataRecordsTableRow from './MyDataRecordsTableRow.vue'
export default {
  name: 'MyDataRecordsTable',
  components: {
    // MyDataRecordsTableRow
    Item
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Type', value: 'type', width:"96px", 
          sort:(a, b) => {
            if (a === b) { return 0 }
            else if (a === "Currency" || (a < b && b !== "Currency")) { return -1 }
            else { return 1 }
          }
        }, 
        { text: 'Quantity', value: 'quantity', groupable: false },
        { text: 'Icon', 
          value: 'icon', 
          sortable: false,
          groupable: false,
          width: "64px"
        }, 
        { text: 'Name', value: 'name', groupable: false }, 
        { text: 'Upgrades?', value: 'upgrades', groupable: false },
        // { text: 'Date', value: 'end_time', groupable: false },
        { text: 'ID', value: 'element_id', width:"96px", groupable: false }, 
      ],
    }
  },
  props: {
    // columnConfigs: Array, 
    dataRecordLinesWithElementDetails: Array,
    description: String,
    endTime: Date,
  },
  computed: {
    ...mapGetters([
      'currencyLookup',
      'itemLookup',
    ]),

  },
  methods: {
    getCSVString(){
      const columnTitles = [
        'element_id',
        'element_type',
        'name',
        'upgrades',
        'quantity',
      ]
      let csvRows = [columnTitles]
      this.dataRecordLinesWithElementDetails.forEach((line) => {
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
      
      anchor.download = `${this.description}_${this.endTime}.csv`;
      anchor.click();
    }
  }
}


</script>

<style>

</style>