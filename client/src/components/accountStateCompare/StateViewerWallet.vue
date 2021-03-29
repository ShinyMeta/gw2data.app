<template>
  <div class="StateViewerWallet">
    <Currency v-for="(currency) in sortedWallet" 
      :key="currency.id" 
      :imageUrl="currencyLookup[currency.id].icon"
      :name="currencyLookup[currency.id].name"
      :id="currency.id"
      :description="currencyLookup[currency.id].description"
      :quantity="currency.value"
      />
  </div>
</template>

<script>
import Currency from '@/components/Currency'

export default {
  name: "StateViewerWallet",
  components: {
    Currency

  },
  props: {
    wallet: Array,
    currencyLookup: Object,

  },
  computed: {
    sortedWallet()  {
      const sortedWallet = [...this.wallet]
      sortedWallet.sort((a,b) => {
        return this.currencyLookup[a.id].order - this.currencyLookup[b.id].order
      })
      return sortedWallet
    }
  }
}
</script>

<style>
.StateViewerWallet {
  text-align: center;
}

</style>