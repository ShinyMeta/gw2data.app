<template>
  <div class="DropMoleculeItemList d-flex">
    <ItemSmart
      v-for="(quantity, id) in items"
      :key="`item-${id}`"
      :id="+id"
      :quantity="quantity"
    />
  </div>
</template>

<script>
import ItemSmart from "@/components/ItemSmart.vue";
export default {
  name: "DropMoleculeItemList",
  components: {
    ItemSmart,
  },
  props: {
    items: Object,
  },
};
</script>

<style></style>
