<template>
  <div class="SaveNewDataRecord">
      
      


      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="description"
              label="Description"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="details"
              label="Details"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="primary_tag"
              label="Primary Tag"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <key-element-selector
              v-model="keyElement"
              :elements="newDataRecordLinesWithElementDetails"
              :search="keyElementSearch"
            />
          </v-col>
          <v-col cols=4>
            <v-text-field
              v-model="keyElementSearch"
              label="Filter Key Element Selector"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="submitRecord">Submit Record</v-btn>
          </v-col>
        </v-row>
      </v-container>

      
      
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KeyElementSelector from '../components/SaveNewDataRecord/KeyElementSelector.vue'
export default {
  components: { KeyElementSelector },
  name: 'SaveNewDataRecord',

  data: () => {
    return {
      description: '',
      details: '',
      primary_tag: '',
      keyElement: null,
      keyElementSearch:''
    }
  },
  methods: {
    ...mapActions('newDataRecord', [
      'updateNewDataRecord'
    ]),
    submitRecord() {
      this.updateNewDataRecord({
        description: this.description,
        details: this.details,
        primary_tag: this.primary_tag,
        primary_element_id: this.keyElement.element_id,
        primary_element_type: this.keyElement.element_type,
      })
      .then(() => {
        const newRecord = this.newDataRecord
        newRecord.lines = this.newDataRecordLines
        console.log('sending newRecord')
        console.log(newRecord)
        this.$axios.post(`/api/dataRecord/new`, newRecord)
          .then(({data}) => {
            this.$router.push(`DataRecordDetail/${data.id}`)
          })
          .catch((err) => {
            alert(err)
          })
      })

    },
    getDetailForLineElement(type, id) {
      if (type === 'Currency') {
        return this.currencyLookup[id]
      }
      if (type === 'Item') {
        return this.itemLookup[id]
      }
      return null
    }
  },
  computed: {
    ...mapGetters([
      'itemLookup',
      'currencyLookup',
    ]),
    
    ...mapGetters('newDataRecord', [
      'newDataRecord',
      'newDataRecordLines',
      'newDataRecordLinesWithElementDetails',
    ]),
  }

}
</script>

<style>

</style>