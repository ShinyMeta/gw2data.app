<template>
  <div>
    <h1>Mats</h1>

    <div v-for="(category) in ( materialStorageDetails )"
      :key="category.id"
      >
      <h3>{{category.name}}</h3>
      <div class="materialStorageSection">
        <Item v-for="(itemid, index) in category.items"
          :key="`${category.name}_${index}`"
          :imageUrl="itemLookup[itemid]?itemLookup[itemid].icon:undefined"
          :name="itemLookup[itemid]?itemLookup[itemid].name:undefined"
          :id="itemid"
          :description="itemLookup[itemid]?itemLookup[itemid].description:undefined"
          :quantity="materialStorage.itemidLookup&&materialStorage.itemidLookup[itemid]?materialStorage.itemidLookup[itemid].count:0"
          :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
          />
      </div>

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
  methods: {
  },

  
}
</script>

<style scoped>
  .materialStorageSection {
    display: grid;
    justify-content: center;
    grid-template: repeat(auto-fill, 64px) / repeat(10 , 64px);
  }


</style>