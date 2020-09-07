<template>
  <div>
    <img class="currencyIcon"
      :src="imageUrl" 
      :alt="name" 
      :title="description"
      />
    <span>{{name}} - {{quantity}}</span>
  </div>
</template>

<script>
export default {
name: "currency",
  components:{

  },
  props: {
    imageUrl: {
      type: String,
      default: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png"
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
  .currencyIcon {
    height: 30px;
  }
</style>