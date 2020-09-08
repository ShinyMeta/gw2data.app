<template>
  <div>
    <h1>Mats</h1>

    <div v-for="(category) in ( materialStorageDetailsSortedByOrder )"
      :key="category.id">
      <h3>{{category.name}}</h3>
      <Item v-for="(itemid, index) in category.items"
        :key="`${category.name}_${index}`"
        :imageUrl="itemLookup[itemid].icon"
        :name="itemLookup[itemid].name"
        :id="itemid"
        :description="itemLookup[itemid].description"
        :quantity="itemid"
        :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
        />

    </div>
  </div>
</template>

<script>
import Item from "./Item"

export default {
name: "StateViewerMaterialStorage",
  components:{
    Item

  },
  props: {
    materialStorage: Object,
    itemLookup: Object,
    materialStorageDetails: Array

  },
  computed: {
    materialStorageDetailsSortedByOrder() {
      let orderArray = this.materialStorageDetails.map((x) => x.order)
      let orderLookup = {}
      this.materialStorageDetails.forEach((category) => {
        orderLookup[category.order] = category
      })
      orderArray.sort((a, b) => a - b)
      return orderArray.map((x) => orderLookup[x])
    }
  }

  
}
</script>

<style>

</style>