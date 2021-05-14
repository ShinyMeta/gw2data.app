<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            {{summaryReport.name}}
          </v-card-title>
          <v-card-text>
            <tags-list-cell
              :tagNames="summaryReport.tagList.map(x=>x.name)"
            />
          </v-card-text>
          <v-card-text>
            <!-- dataes here -->
            {{dateFilterString}}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>
            {{elementDetails.name}}
          </v-card-title>
          <v-card-subtitle>
            {{summaryReport.element_type}} ID: {{summaryReport.element_id}}
          </v-card-subtitle>

          <v-card-text>
            <item 
              :imageUrl="elementDetails.icon"
              :name="elementDetails.name"
              :quantity="elementQuantity"
              />
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <data-record-form-button
              :dataRecord="dataRecordWithDetails"
              editForm
              @edit="onEdit"
            /> -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import Item from '../Item.vue'
// import DataRecordFormButton from '../SaveNewDataRecord/DataRecordFormButton.vue'
import TagsListCell from '../dataRecordViewer/TagsListCell.vue'
import { mapGetters } from 'vuex'

export default {
  name: "SummaryReportInfo",
  components: {
    Item,
    // DataRecordFormButton,
    TagsListCell,
  },
  props: {
    summaryReport: Object,
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'elementLookup',
    ]),
    elementDetails() {
      return this.elementLookup[this.summaryReport.element_type][this.summaryReport.element_id]
    },
    elementQuantity() {
      let quantity = 0
      this.summaryReport.dataRecordLines.forEach(line => {
        if (line.element_id === this.summaryReport.element_id
          && line.element_type === this.summaryReport.element_type) {
            quantity += line.quantity
          }
      })
      return quantity
    },
    dateFilterString() {
      if (this.summaryReport.start_date && this.summaryReport.end_date) {
        return `Records between ${this.summaryReport.start_date.toLocaleDateString()} and ${this.summaryReport.end_date.toLocaleDateString()}`
      }
      else if (this.summaryReport.start_date && !this.summaryReport.end_date) {
        return `Records after ${this.summaryReport.start_date.toLocaleDateString()}`
      }
      else if (!this.summaryReport.start_date && this.summaryReport.end_date) {
        return `Records before ${this.summaryReport.end_date.toLocaleDateString()}`
      }
      else {
        return 'No date filter set'
      }
    }
  }

}
</script>

<style>

</style>