<template>
  <img class="CurrencyIcon ml-1 mr-2"
    :src="imageUrl" 
    :alt="name" 
    :title="description"
    />
</template>

<script>
export default {
  name: "CurrencyIcon",
  props: {
    imageUrl: {
      type: String,
      default: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png"
    },
    name: String,
    description: String,
  }
}
</script>

<style scoped>
.CurrencyIcon {
  height: 30px;
}
</style>