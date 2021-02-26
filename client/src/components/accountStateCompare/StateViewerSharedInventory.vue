<template>
  <div>
    <h1>Shared Inventory</h1>
    <div id="sharedInventoryItems" 
    :style="`grid-template: repeat(${sharedInventory.length/10}, 64px) / repeat(10 , 64px)`">
      <Item class="item" v-for="(sharedInventoryItem,index) in sharedInventory"
        :key="`sharedInventoryItem_${index}`"
        :imageUrl="sharedInventoryItem&&itemLookup[sharedInventoryItem.id]?itemLookup[sharedInventoryItem.id].icon:undefined"
        :name="sharedInventoryItem&&itemLookup[sharedInventoryItem.id]?itemLookup[sharedInventoryItem.id].name:undefined"
        :id="sharedInventoryItem?sharedInventoryItem.id:undefined"
        :description="sharedInventoryItem&&itemLookup[sharedInventoryItem.id]?itemLookup[sharedInventoryItem.id].description:undefined"
        :quantity="sharedInventoryItem?sharedInventoryItem.count:undefined"
        :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
        />
    </div>

  </div>
</template>

<script>
import Item from "@/components/Item"

export default {
  name: "StateViewerSharedInventory",
  components:{
    Item
  },
  props: {
    sharedInventory: Array,
    itemLookup: Object    
  },
}
</script>

<style>
  #sharedInventoryItems{
    display: grid;
    justify-content: center;
  }
</style>