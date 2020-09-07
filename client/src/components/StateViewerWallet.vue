<template>
  <div>

    <h1>Wallet Goes Here</h1>
    <Currency v-for="(currency) in wallet" 
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
import Currency from './Currency'

export default {
  name: "StateViewerWallet",
  components: {
    Currency

  },
  props: {
    wallet: Array,
    currencyLookup: Object,

  }
}
</script>

<style>

</style>