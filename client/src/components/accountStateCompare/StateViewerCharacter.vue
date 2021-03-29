<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      {{character.name}} - {{filledInventorySlots}}/{{inventorySize}}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="inventorySection">
        <Item v-for="(item, index) in itemsInInventory"
          :key="`${character.name}_${index}`"
          :imageUrl="item&&itemLookup[item.id]?itemLookup[item.id].icon:undefined"
          :name="item&&itemLookup[item.id]?itemLookup[item.id].name:undefined"
          :id="item?item.id:undefined"
          :description="item&&itemLookup[item.id]?itemLookup[item.id].description:undefined"
          :quantity="item?item.count:undefined"
          :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
          />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>


  <!-- <div>
    

    <details>
      <summary>{{character.name}} - {{filledInventorySlots}}/{{inventorySize}}</summary> -->
      
    <!-- </details>
  </div>-->

</template> 

<script>
import Item from "@/components/Item"

export default {
name: "StateViewerCharacter",
  components:{
    Item
  },
  props: {
    character: Object,
    itemLookup: Object
  },
  computed: {
    itemsInInventory() {
      let items = []
      this.character.bags.forEach((bag) => {
        if (bag) {
          bag.inventory.forEach((item) => {
            items.push(item)
          })
        }
      })

      return items
    },
    inventorySize() {
      return this.itemsInInventory.length
    },
    filledInventorySlots() {
      return this.itemsInInventory.reduce((total, x) => x?total+1:total, 0)
    }
  }
}
</script>

<style>
  .inventorySection {
    display: grid;
    justify-content: center;
    grid-template: repeat(auto-fill, 64px) / repeat(10 , 64px);
  }
</style>