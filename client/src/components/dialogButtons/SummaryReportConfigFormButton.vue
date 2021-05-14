<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    no-click-animation
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        {{buttonLabel}}
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{dialogTitle}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container class="SaveNewDataRecord">
        <v-row>
          <v-col>
            <v-text-field
              v-model="name"
              label="Report Name*"
              filled
              counter=200
              :error-messages="nameError"
            ></v-text-field>
          </v-col>
          <v-col cols=3>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="startDate"
                  label="Only include records after:"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                @input="startDateMenu = false"
                show-current
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols=3>
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="endDate"
                  label="Only include records before:"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <tag-selector 
              v-model="tags"
              :preselected="prevReport?prevReport.tags:[]"
              :error-messages="tagsError"
              filled
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <key-element-selector v-if="lookupsReady"
              v-model="keyElement"
              :elements="keyElements"
              :preselected="{
                element_id: prevReport ? prevReport.primary_element_id:null,
                element_type: prevReport ? prevReport.primary_element_type:null
              }"
              :error-messages="keyElementError"
              filled
            />
          </v-col>
        </v-row>
      </v-container>
        
        
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KeyElementSelector from '../selects/KeyElementSelector.vue'
import TagSelector from '../selects/TagSelector.vue'
export default {
  components: { 
    KeyElementSelector, 
    TagSelector,
  },
  name: 'SummaryReportConfigFormButton',
  props:{
    prevReport: Object,
    editForm: Boolean,
    newForm: Boolean,
  },
  data() {
    return {
      dialog: false,
      startDateMenu: false,
      endDateMenu: false,
      lookupsReady: false,
      
      name: this.prevReport ? this.prevReport.name || '' : '',
      details: this.prevReport ? this.prevReport.details || '' : '',
      tags: [],
      keyElement: null,
      startDate: this.prevReport ? this.prevReport.name || null : null,
      endDate: this.prevReport ? this.prevReport.name || null : null,

      nameError: '',
      tagsError: '',
      keyElementError: '',
    }
  },
  computed: {
    ...mapGetters([
      'dataRecords',
      'itemLookup',
      'currencyLookup',
      'elementLookup'
    ]),
    dialogTitle() {
      if (this.newForm) return 'New Summary Report'
      else if (this.editForm) return 'Edit Summary Report'
      else return 'Summary Report'
    },
    buttonLabel() {
      if (this.newForm) return 'New Summary Report'
      if (this.editForm) return 'Edit Report'
      return 'Default Text'
    },

    keyElements() {
      //this should only be uniques...
      const uniques = {
        Item: {},
        Currency: {}
      }
      const result = []
      this.dataRecords.forEach(x => {
        if (!uniques[x.primary_element_type][x.primary_element_id]) {
          if (this.elementLookup[x.primary_element_type][x.primary_element_id]) {
            result.push({
              element_id: x.primary_element_id,
              element_type: x.primary_element_type,
              ...this.elementLookup[x.primary_element_type][x.primary_element_id]
            })
            uniques[x.primary_element_type][x.primary_element_id] = true
          }
          else {
            result.push({name:'Loading...'})
          }
        }
      })
      return result
      
    },

    reportToPost() {
      const reportToPost = Object.assign({}, this.prevReport, {
        name: this.name,
        element_id: this.keyElement.element_id,
        element_type: this.keyElement.element_type,
        tagList: this.tags,
        start_date: this.startDate,
        end_date: this.endDate,
      })

      return reportToPost
    }
  },
  methods: {
    ...mapActions([
      'fetchDataRecords',
      'addItemsToLookupFromApi',
      'loadCurrencyLookupFromApi',
    ]),
    save() {
      this.clearErrors()
      if (!this.formRequirementsMet()) {
        return
      }
      if (this.newForm) {
        return this.saveNewRecord()
      }
      else if (this.editForm) {
        return this.saveEditRecord()
      }

    },
    saveNewRecord() { //localhost/api/report/summaryReport/new
      this.$axios.post(`/api/report/summaryReport/new`, this.reportToPost)
        .then(({data}) => {
          this.$router.push(`ViewSummaryReport/${data.id}`)
        })
        .catch((err) => {
          alert(err)
        })
    },
    saveEditRecord() {
      this.$axios.post(`/api/report/summaryReport/edit`, this.reportToPost)
        .then(() => {
          this.$emit('edit', this.reportToPost)
          this.dialog = false
        })
        .catch((err) => {
          alert(err)
        })
    },
    formRequirementsMet(){
      //name not empty
      if (!this.name || this.name.trim() === ''){
        this.nameError = 'Required'
      }
      //at least one tag selected
      if (this.tags.length <= 0){
        this.tagsError = 'Select at least one tag for Primary Tag'
      }
      //key element selected
      if (!this.keyElement) {
        this.keyElementError = "Required"
      }
      if(this.nameError || this.tagsError || this.keyElementError){
        return false
      }
      else { return true }
    },
    clearErrors(){
      this.nameError = ''
      this.tagsError = ''
      this.keyElementError = ''
    }
  },

  created() {
    const dataRecordsAndItemsPromise =  this.fetchDataRecords()
      .then(() => {
        const idsToFetch = this.dataRecords
          .filter(x => x.primary_element_type === 'Item')
          .map(x => x.primary_element_id)
        return this.addItemsToLookupFromApi(idsToFetch)
      })
      .then(() => {
        //add the name and icon to the dataRecords
      })

    const currencyPromise = this.loadCurrencyLookupFromApi()

    return Promise.all([
      dataRecordsAndItemsPromise,
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