<template>
<div>
  <img class="currencyIcon"
    :src="imageUrl" 
    :alt="name" 
    :title="`${name} - ${id}\n${description}`"
    />
  <span>{{quantity}}</span>
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

<style>

</style>