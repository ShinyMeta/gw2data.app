<template>
  <v-select class="KeyElementSelector"
    v-model="selectedElement"
    :items="sortedFilteredElements"
    @change="selectOnChange"
    @blur="onBlur"

    :error-messages="errorMessages"
    label="Select the Key Element for this Record*"
    return-object
    :filled="filled"
    :outlined="outlined"
    height="104"
  >

    <template v-slot:prepend-item>
      <v-text-field
        v-model="search"
        label="Click here to filter list"
        @blur="onBlur"
        class="mx-2"
      ></v-text-field>
    </template>



    <template v-slot:selection="data">
      <item
        :imageUrl="data.item.icon"
        :name="data.item.name"
        :id="data.item.element_id"
        :description="data.item.description"
        :showPosNeg="false"
      /> {{ data.item.name }}
    </template>
    <template v-slot:item="data">
      <item
        :imageUrl="data.item.icon"
        :name="data.item.name"
        :id="data.item.element_id"
        :description="data.item.description"
        :showPosNeg="false"
      /> {{ data.item.name }} ({{ data.item.quantity }})
    </template>
  
  </v-select>
  
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import Item from '../Item.vue'

export default {
  components: { Item },
  name: 'KeyElementSelector',
  props: {
    value: Object,
    elements: Array,
    preselected: Object,
    // oldSearch: String,
    filled: Boolean,
    outlined: Boolean,
    errorMessages: String||Array,
  },
  data() {
    return {
      selectedElement: null,
      search: ''
    } 
  },
  computed:{
    // ...mapGetters([
    // ])
    sortedFilteredElements() {
      const result = [...this.elements.filter(x => {
        return x.name.toLowerCase().match(this.search.toLowerCase())
      })]

      result.sort((a,b) => {
        const aVal = Math.abs(a.quantity),
          bVal = Math.abs(b.quantity)
        return bVal-aVal
      })

      return result
    }
  },
  methods:{
    // ...mapActions([
    // ]),
    selectOnChange() {
      this.$emit('input', this.selectedElement)
    },
    onBlur() {
      this.search = ''
    },
  },
  created() {
    if (this.preselected) {
      this.selectedElement = this.elements.find(y => {
        return (y.element_id === this.preselected.element_id && y.element_type === this.preselected.element_type)
      })
      this.$emit('input', this.selectedElement)
    }
  }

}
</script>

<style>

</style>