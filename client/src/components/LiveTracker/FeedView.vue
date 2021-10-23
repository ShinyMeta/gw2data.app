<template>
  <v-container class="FeedView">
    <v-row>
      <v-col cols="9">
        drops from DRF:
      </v-col>
      <v-col>
        <v-btn @click="downloadCsv">Download CSV</v-btn>
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
import { mapGetters } from "vuex";
import DropMolecule from "./DropMolecule.vue";
export default {
  name: "FeedView",
  components: {
    DropMolecule,
  },
  props: {
    dropsFromDrf: Array,
  },
  computed: {
    ...mapGetters(["itemLookup", "currencyLookup"]),
  },
  methods: {
    getCSVString() {
      const columnTitles = [
        "dropIndex",
        "timestamp",
        "elementType",
        "elementId",
        "name",
        // 'upgrades',
        "quantity",
      ];
      let csvRows = [columnTitles];
      const sortedDrops = this.sortedDrops();
      sortedDrops.forEach((drop, index) => {
        csvRows.push(...this.dropToCsvRows(drop, index));
      });
      // let result = "data:text/csv;charset=utf-8,"
      //     + csvRows.map(e => e.join(",")).join("\n");
      let result = csvRows.map((e) => e.join(",")).join("\n");
      return result;
    },
    dropToCsvRows(drop, index) {
      const result = [];
      for (const currId of Object.keys(drop.curr)) {
        const newRow = [
          index,
          drop.timestamp,
          "Currency",
          currId,
          this.currencyLookup[currId].name,
          drop.curr[currId],
        ];
        result.push(newRow);
      }
      for (const itemId of Object.keys(drop.items)) {
        const newRow = [
          index,
          drop.timestamp,
          "Item",
          itemId,
          this.itemLookup[itemId].name,
          drop.items[itemId],
        ];
        result.push(newRow);
      }
      return result;
    },
    downloadCsv() {
      const anchor = document.createElement("a");
      anchor.href =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(this.getCSVString());
      anchor.target = "_blank";

      anchor.download = `${new Date().toJSON()}.csv`;
      anchor.click();
    },
    sortedDrops() {
      const result = [...this.dropsFromDrf];
      result.sort((a, b) => b.timestamp - a.timestamp);
      return result;
    },
  },
};
</script>

<style></style>
