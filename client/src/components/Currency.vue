<template>
  <div class="currency">
    <span v-if="this.id!=1">{{quantity}}
    <currency-icon
      :src="imageUrl" 
      :alt="name" 
      :title="description"
    />
    </span>
    <currency-coin v-else
      :description="description"
      :quantity="quantity"
      :showPosNeg="showPosNeg"
    />
  </div>
</template>

<script>
import CurrencyCoin from './CurrencyCoin.vue'
import CurrencyIcon from './CurrencyIcon.vue'
export default {
  name: "currency",
  components:{
    CurrencyIcon,
    CurrencyCoin

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
  },
}
</script>

<style scoped>
span{
  display: inline-flex;
  align-items: center;
}
.currency {
  text-align: right;
}
</style>