<template>
<div class="Item">
  <img class="itemIcon"
    :src="imageUrl" 
    :alt="name" 
    :class="quantity===0?'zeroQtyItem':''"
    />
    <!-- <div id="quantityContainer" v-if="quantity"> -->
    <div id="quantity" 
      v-if="quantity !== undefined"
      :title="`${name} - ${id}\n${description}`">
        {{quantity}}
      </div>
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
.Item {
  height: 64px;
  width: 64px;
}

.itemIcon {
  height: 64px;
}

.zeroQtyItem {
  /* filter: blur(5px); */
  /* filter: brightness(0.4); */
  /* filter: contrast(200%); */
  /* filter: drop-shadow(16px 16px 20px yellow); */
  /* filter: grayscale(100%); */
  /* filter: hue-rotate(90deg); */
  /* filter: invert(75%); */
  /* filter: opacity(75%); */
  filter: opacity(75%) grayscale(100%);
  /* filter: saturate(20%); */
  /* filter: sepia(100%); */
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