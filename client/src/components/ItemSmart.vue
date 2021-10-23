<template>
  <div class="ItemSmart">
    <Item
      :id="id"
      :quantity="quantity"
      :showPosNeg="showPosNeg"
      :imageUrl="imageUrl"
      :name="name"
      :description="description"
      :rarity="rarity"
    />
  </div>
</template>

<script>
import Item from "@/components/Item";
export default {
  name: "ItemSmart",
  components: {
    Item,
  },
  props: {
    id: Number,
    quantity: {
      type: Number,
      default: null,
    },
    showPosNeg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      itemFromApi: null,
    };
  },
  computed: {
    imageUrl() {
      return this.itemFromApi
        ? this.itemFromApi.icon
        : "/images/empty_item_slot.png";
    },
    name() {
      return this.itemFromApi ? this.itemFromApi.name : "";
    },
    description() {
      return this.itemFromApi ? this.itemFromApi.description : "";
    },
    rarity() {
      return this.itemFromApi ? this.itemFromApi.rarity : "";
    },
  },
  methods: {},
  created() {
    if (this.id) {
      this.$gw2api
        .items()
        .autoBatch()
        .get(this.id)
        .then((itemData) => {
          this.itemFromApi = itemData;
        });
    }
  },
};
</script>

<style></style>
