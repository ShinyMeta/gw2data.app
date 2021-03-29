<template>
  <v-select class="KeyElementSelector"
    v-model="selectedElement"
    :items="sortedFilteredElements"
    @change="selectOnChange"

    label="Select the Key Element for this Record"
    return-object
    
  >
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
    search: String
  },
  data() {
    return {
      selectedElement: null
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
      console.log(this.selectedElement)
      this.$emit('input', this.selectedElement)
    }
  }

}
</script>

<style>

</style>