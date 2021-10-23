<template>
<v-card>
  <v-card-subtitle>
{{ timeString }}
  </v-card-subtitle>
  <v-container class="DropMolecule">
    <v-row>
      <v-col cols=4>
        <!-- currencies -->
        Currencies:
        <drop-molecule-currency-list :currencies="dropMolecule.curr" />
      </v-col>
      <v-col cols=8>
        <!-- items -->
        Items:
        <drop-molecule-item-list :items="dropMolecule.items" />
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
import DropMoleculeCurrencyList from "./DropMoleculeCurrencyList.vue";
import DropMoleculeItemList from "./DropMoleculeItemList.vue";
export default {
  components: {
    DropMoleculeCurrencyList,
    DropMoleculeItemList,
  },
  name: "DropMolecule",
  props: {
    dropMolecule: Object,
  },
  computed: {
    timeString() {
      const dropTime = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(this.dropMolecule.timestamp));
      return dropTime;
    },
  },
};
</script>

<style></style>
