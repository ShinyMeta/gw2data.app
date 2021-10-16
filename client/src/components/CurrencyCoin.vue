<template>
  <div class="CurrencyCoin">
    <span>{{posNegString}}</span>
    <span v-if="this.gold_qty>0">
      {{gold_qty}}
      <currency-icon
        :src="GOLD_COIN_ICON" 
        :alt="'Gold Coin'" 
        :title="description"
      />
    </span>
    <span v-if="this.silver_qty>0">
      {{silver_qty}}
      <currency-icon
        :src="SILVER_COIN_ICON" 
        :alt="'Silver Coin'" 
        :title="description"
      />
    </span>
    <span>
      {{copper_qty}}
      <currency-icon
        :src="COPPER_COIN_ICON" 
        :alt="'Copper Coin'"
        :title="description"
      />
    </span>
  </div>
</template>

<script>
import CurrencyIcon from './CurrencyIcon.vue'
export default {
  name: 'CurrencyCoin',
  components:{
    CurrencyIcon
  },
  props:{
    description: String,
    quantity: Number,
    showPosNeg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      GOLD_COIN_ICON:'https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png',
      SILVER_COIN_ICON: 'https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png',
      COPPER_COIN_ICON: 'https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png',

    }
  },
  computed: {
    posNegString() {
      if (this.quantity < 0) {
        return "-"
      }
      else if (this.quantity > 0 && this.showPosNeg){
        return "+"
      }
      else { 
        return "" 
      }
    },
    absolute_qty() {
      return Math.abs(this.quantity)
    },
    gold_qty() {
      return Math.floor(this.absolute_qty/10000)
    },
    silver_qty() {
      return (this.absolute_qty%10000-this.copper_qty)/100
    },
    copper_qty() {
      return this.absolute_qty%100
    },
  }
}
</script>

<style>
span{
  display: inline-flex;
  align-items: center;
}

</style>