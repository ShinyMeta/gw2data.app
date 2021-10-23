<template>
  <v-container class="LiveTracking">
    <v-row>
      <v-col cols="12">
        <AddRule :itemsSoFar="itemsSoFar" :currenciesSoFar="currenciesSoFar" />
        <rule-display
          v-for="(rule, index) in rules"
          :key="`rule-${index}`"
          :rule="rule"
        />
        <v-tabs v-model="dataViewTab" centered>
          <v-tab :href="'#tab-live-feed'">
            Live Feed
          </v-tab>
          <v-tab :href="'#tab-summary'">
            Summary
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="dataViewTab">
          <v-tab-item :value="'tab-live-feed'">
            <feed-view :dropsFromDrf="dropsFilteredByRules" />
          </v-tab-item>
          <v-tab-item :value="'tab-summary'">
            <summary-view :dropsFromDrf="dropsFilteredByRules" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FeedView from "../components/LiveTracker/FeedView.vue";
import AddRule from "../components/LiveTracker/AddRule.vue";
import SummaryView from "../components/LiveTracker/SummaryView.vue";
import RuleDisplay from "../components/LiveTracker/RuleDisplay.vue";
export default {
  name: "DataRecordDetail",
  components: {
    SummaryView,
    FeedView,
    AddRule,
    RuleDisplay,
  },
  data() {
    return {
      dataViewTab: "tab-live-feed",
      dropsFromDrf: [],
      dropBuffer: [],
      drfWebSocket: null,
      bufferTimer: null,
      currenciesSoFar: {},
      itemsSoFar: {},
    };
  },
  computed: {
    ...mapGetters(["rules", "itemLookup"]),
    dropsFilteredByRules() {
      const result = [];
      this.dropsFromDrf.forEach((drop) => {
        for (let i = 0; i < this.rules.length; i++) {
          if (!this.rules[i].dropMatches(drop, this.itemLookup)) {
            return;
          }
        }
        //passed all rules
        result.push(drop);
      });
      return result;
    },
  },
  methods: {
    ...mapActions(["addItemsToLookupFromApi", "loadCurrencyLookupFromApi"]),
    sortDrops() {
      this.dropsFromDrf.sort((a, b) => b.timestamp - a.timestamp);
    },
    addBufferToView() {
      if (this.bufferTimer) {
        return; // wait for timer
      } else if (this.dropBuffer.length > 0) {
        this.dropsFromDrf.unshift(...this.dropBuffer);
        this.addIdsToFoundSoFar(this.dropBuffer);
        this.dropBuffer = [];
        this.startBufferTimer();
      } else {
        return;
      }
    },
    startBufferTimer() {
      this.bufferTimer = setTimeout(
        (() => {
          this.bufferTimer = null;
          this.addBufferToView();
        }).bind(this),
        1000
      );
    },
    addIdsToFoundSoFar(drops) {
      for (const drop of drops) {
        for (const currId of Object.keys(drop.curr)) {
          if (!this.currenciesSoFar[currId]) {
            this.currenciesSoFar[currId] = 0;
          }
          this.currenciesSoFar[currId]++;
        }
        for (const itemId of Object.keys(drop.items)) {
          if (!this.itemsSoFar[itemId]) {
            this.itemsSoFar[itemId] = 0;
            this.addItemsToLookupFromApi([itemId]);
          }
          this.itemsSoFar[itemId]++;
        }
      }
    },
  },
  created() {
    this.drfWebSocket = new WebSocket("wss://drf.gw2.dev/ws");
    this.drfWebSocket.onmessage = (event) => {
      this.dropBuffer.unshift(JSON.parse(event.data));
      this.addBufferToView();
    };
    this.loadCurrencyLookupFromApi();
  },
  destroyed() {
    this.drfWebSocket.close();
  },
};
</script>

<style></style>
