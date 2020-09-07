<template>
  <div>
    <h1>Bank</h1>
    <div id="bankItems">
      <Item v-for="(bankItem,index) in bank"
        :key="`bankItem_${index}`"
        :imageUrl="bankItem?itemLookup[bankItem.id].icon:undefined"
        :name="bankItem?itemLookup[bankItem.id].name:undefined"
        :id="bankItem?bankItem.id:undefined"
        :description="bankItem?itemLookup[bankItem.id].description:undefined"
        :quantity="bankItem?bankItem.count:undefined"
        :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
        />
    </div>

  </div>
</template>

<script>
import Item from "./Item"

export default {
  name: "StateViewerBank",
  components:{
    Item
  },
  props: {
    bank: Array,
    itemLookup: Object    
  }
}
</script>

<style>
  #bankItems{
    display: grid;
    grid-template: repeat(auto-fill , 64px) / repeat(10 , 64px)
  }

</style>