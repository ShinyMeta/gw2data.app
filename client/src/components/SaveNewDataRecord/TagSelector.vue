<template>
  <v-select
    v-model="selected"
    :items="filteredTags"
    item-text="name"
    @change="onChange"
    @blur="onBlur"
    return-object

    label="Select Tags"
    :error-messages="errorMessages"
    no-data-text="No tags matching filter"
    multiple
    :clearable="clearable"
    chips
    :filled="filled"
  >

    <template v-slot:prepend-item>
      <v-text-field
        v-model="search"
        label="Filter Tags"
        @blur="onBlur"
        class="mx-2"
      >
      
        <template v-slot:append>
          <v-btn 
            v-if="filteredTags.length===0" 
            @click="addTag"
            icon
            >
            <v-icon>mdi-tag-plus</v-icon>
          </v-btn>
        </template>
      
      </v-text-field>
    </template>
    

  </v-select>
</template>

<script>
export default {
  name: 'TagSelector',
  props: {
    value: Array,
    filled: Boolean,
    preselected: Array,
    errorMessages: String||Array,
    clearable: { type:Boolean, default: false}
  },
  data(){
    return {
      selected: [],
      search: '',
      tags: [
        {name: 'General Farm', id: 'default'},
        {name: 'Gathering', id: 'default'},
        {name: 'Crafting', id: 'default'},
        {name: 'Mystic Forge', id: 'default'},
        {name: 'Container', id: 'default'},
        {name: 'Salvage', id: 'default'},
      ]

    }
  },
  computed: {
    filteredTags() {
      if (!this.search) {
        return this.tags
      }
      return this.tags.filter(x => {
        return x.name.toLowerCase().match(this.search.toLowerCase())})
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.selected)
    },
    onBlur() {
      this.search = ''
    },
    addTag() {
      this.tags.push({name: this.search, id: 'new'})
    }
  },
  created() {
    this.$axios.get(`/api/dataRecord/customTags`)
      .then(({data}) => {
        if (!data.tags) {return}
        data.tags.forEach((tag) => {this.tags.push(tag)})
        if (this.preselected) {
          this.preselected.forEach(x => {
            this.selected.push(this.tags.find(y => y.name === x.name))
            this.$emit('input', this.selected)
          })
        }
      })
  }

}
</script>

<style>

</style>