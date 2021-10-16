<template>
  <v-container class="FeedView">
    <v-row>
      <v-col cols=10>
        drops from DRF:
      </v-col>
    </v-row>

    <v-row
      v-for="(drop, dropindex) in dropsFromDrf"
      :key="`droplist-${dropindex}`"
    >
      <v-col cols="10">
        <!-- {{ drop }} -->
        <drop-molecule :dropMolecule="drop" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DropMolecule from './DropMolecule.vue'
export default {
  name: "FeedView",
  components: {
    DropMolecule

  },
  props: {
    dropsFromDrf: Array,
  },
}
</script>

<style>

</style>