<template>
<div>
  <img class="itemIcon"
    :src="imageUrl" 
    :alt="name" 
    :title="`${name} - ${id}\n${description}`"
    />
    <!-- <div id="quantityContainer" v-if="quantity"> -->
      <div id="quantity" v-if="quantity">{{quantity}}</div>
    <!-- </div> -->
</div>
</template>

<script>
export default {
name: "Item",
  components:{

  },
  props: {
    imageUrl: {
      type: String,
      default: "/images/empty_item_slot.png"
    },
    name: String,
    id: Number,
    description: String,
    quantity: Number,
    showPosNeg: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.itemIcon {
  height: 64px;
}

#quantity {
  height: 64px;
  width: 60px;
  top: -66px;
  position: relative;
  text-align: right;  
  color: white;
  text-shadow: 
    -1px 0px 2px black,
    1px 0px 2px black,
    0px -1px 2px black,
    0px 1px 2px black;
}
</style>