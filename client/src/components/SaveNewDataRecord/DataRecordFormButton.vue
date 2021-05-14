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
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="description"
              label="Description*"
              filled
              counter=200
              :error-messages="descriptionError"
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
              item-text="name"
              label="Primary Tag*"

              persistent-hint
              :hint="tags.length>0?'':'Select at least one Tag first -->'"
              :error-messages="primaryTagError"

              chips
              filled
            ></v-select>
          </v-col>
          <v-col>
            <tag-selector 
              v-model="tags"
              :preselected="dataRecord.tags"
              :error-messages="tagsError"
              filled
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <key-element-selector
              v-model="keyElement"
              :elements="dataRecordLinesWithElementDetails"
              :preselected="{
                element_id: this.dataRecord.primary_element_id,
                element_type: this.dataRecord.primary_element_type
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
import { mapGetters } from 'vuex'
import KeyElementSelector from '../selects/KeyElementSelector.vue'
import TagSelector from '../selects/TagSelector.vue'
export default {
  components: { KeyElementSelector, TagSelector },
  name: 'DataRecordFormButton',
  props:{
    dataRecord: Object, //contains lines and tags
    editForm: Boolean,
    newForm: Boolean,
  },
  data() {
    return {
      dialog: false,

      
      description: this.dataRecord.description || '',
      details: this.dataRecord.details || '',
      primary_tag: this.dataRecord.primary_tag? this.dataRecord.primary_tag : null,
      tags: [],
      keyElement: null,

      descriptionError: '',
      primaryTagError: '',
      tagsError: '',
      keyElementError: '',
    }
  },
  computed: {
    ...mapGetters([
      'itemLookup',
      'currencyLookup',
    ]),
    dialogTitle() {
      if (this.newForm) return 'New Data Record'
      else if (this.editForm) return 'Edit Data Record'
      else return 'Data Record'
    },
    buttonLabel() {
      if (this.newForm) return 'Save Data'
      if (this.editForm) return 'Edit Record'
      return 'Default Text'
    },

    dataRecordLinesWithElementDetails() {
      const result = [...this.dataRecord.lines]
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
    },

    dataRecordToPost() {
      const dataRecordToPost = Object.assign({}, this.dataRecord, {
        description: this.description,
        details: this.details,
        primary_tag: this.primary_tag,
        primary_element_id: this.keyElement.element_id,
        primary_element_type: this.keyElement.element_type,
        tags: this.tags
      })

      return dataRecordToPost
    }
  },
  methods: {
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
    saveNewRecord() {
      this.$axios.post(`/api/dataRecord/new`, this.dataRecordToPost)
        .then(({data}) => {
          this.$router.push(`DataRecordDetail/${data.id}`)
        })
        .catch((err) => {
          alert(err)
        })
    },
    saveEditRecord() {
      this.$axios.post(`/api/dataRecord/edit`, this.dataRecordToPost)
        .then(() => {
          // this.$router.push(`DataRecordDetail/${data.id}`)
          // just update the state, then 
          this.$emit('edit', this.dataRecordToPost)
          this.dialog = false
        })
        .catch((err) => {
          alert(err)
        })
    },
    formRequirementsMet(){
      // description not empty/null
      if (!this.description || this.description.trim() === ''){
        this.descriptionError = 'Required'
      }
      // primary tag and tags
      if (!this.primary_tag || !this.tags.find(x=>x.name === this.primary_tag)){
        this.primaryTagError = 'Required'
      }
      if (this.tags.length <= 0){
        this.tagsError = 'Select at least one tag for Primary Tag'
      }
      // key element
      if (!this.keyElement) {
        this.keyElementError = "Required"
      }
      if(this.descriptionError || this.primaryTagError || this.tagsError || this.keyElementError){
        return false
      }
      else { return true }
    },
    clearErrors(){
      this.descriptionError = ''
      this.primaryTagError = ''
      this.tagsError = ''
      this.keyElementError = ''
    }
  },

  created() {
    if (this.dataRecord.primary_element_id) {
      this.keyElement = this.dataRecordLinesWithElementDetails
        .find(x => x.element_id===this.dataRecord.primary_element_id)
    } 
  }

}
</script>

<style>

</style>