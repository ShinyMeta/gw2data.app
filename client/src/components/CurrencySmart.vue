<template>
  <div class="CurrencySmart">
    <Currency 
      :id="id"
      :quantity="quantity"
      :showPosNeg="showPosNeg"
      :imageUrl="imageUrl"
      :name="name"
      :description="description"
    />
  </div>
</template>

<script>
import Currency from "@/components/Currency.vue";
export default {
  name: "CurrencySmart",
  components: {
    Currency,
  },
  data() {
    return {
      currencyFromApi: null
    }
  },
  props: {
    id: Number,
    quantity: Number,
    showPosNeg: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    imageUrl() {
      return this.currencyFromApi
        ? this.currencyFromApi.icon
        : "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png";
    },
    name() {
      return this.currencyFromApi ? this.currencyFromApi.name : "";
    },
    description() {
      return this.currencyFromApi ? this.currencyFromApi.description : "";
    },
  },
  created() {
    if (this.id) {
      this.$gw2api
        .currencies()
        .autoBatch()
        .get(this.id)
        .then((currencyData) => {
          this.currencyFromApi = currencyData;
        });
    }
  },
};
</script>

<style></style>
