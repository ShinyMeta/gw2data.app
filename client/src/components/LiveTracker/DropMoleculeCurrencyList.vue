<template>
  <div class="DropMoleculeCurrencyList">
    <currency-smart
      v-for="(quantity, id) in currencies"
      :key="`currency-${id}`"
      :id="+id"
      :quantity="quantity"
    />
  </div>
</template>

<script>
import CurrencySmart from "@/components/CurrencySmart.vue";
export default {
  name: "DropMoleculeCurrencyList",
  components: {
    CurrencySmart,
  },
  props: {
    currencies: Object,
  },
};
</script>

<style>
.DropMoleculeCurrencyList {
  max-height: 128px;	
  overflow-y: auto;
}
</style>
