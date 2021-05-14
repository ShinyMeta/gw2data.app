<template>
  <v-container class="SaveNewDataRecord">
    <v-row>
      <v-col>
        <v-text-field
          v-model="description"
          label="Description*"
          filled
          counter=200
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          v-model="details"
          label="Details (optional)"
          auto-grow
          filled
          counter=65535
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="primary_tag"
          :items="tags"
          label="Primary Tag*"

          persistent-hint
          :hint="tags.length>0?'':'Select at least one Tag first -->'"

          chips
          filled
        ></v-select>
        <!-- <v-text-field
          v-model="primary_tag"
          label="Primary Tag"
          filled
        ></v-text-field> -->
      </v-col>
      <v-col>
        <tag-selector 
          v-model="tags"
          filled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <key-element-selector
          v-model="keyElement"
          :elements="newDataRecordLinesWithElementDetails"
          :search="keyElementSearch"
          filled
        />
      </v-col>
      <v-col cols=4>
        <v-text-field
          v-model="keyElementSearch"
          label="Filter Key Element Selector"
          filled
          height="104"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="submitRecord">Submit Record</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KeyElementSelector from '../components/selects/KeyElementSelector.vue'
import TagSelector from '../components/selects/TagSelector.vue'
export default {
  components: { KeyElementSelector, TagSelector },
  name: 'SaveNewDataRecord',

  data: () => {
    return {
      description: '',
      details: '',
      primary_tag: '',
      tags: [],
      keyElement: null,
      keyElementSearch:''
    }
  },
  methods: {
    ...mapActions('newDataRecord', [
      'updateNewDataRecord'
    ]),
    submitRecord() {
      if (!this.description || !this.keyElement) {
        return // form not filled out
      }


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
        newRecord.tags = this.tags.
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