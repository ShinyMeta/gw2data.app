<template>
  <v-container class="LiveTracking">
    <v-row>
      <v-col cols=12>
        <v-tabs
          v-model="dataViewTab"
          centered
        >
          <v-tab :href="'#tab-live-feed'" >
            Live Feed
          </v-tab>
          <v-tab :href="'#tab-summary'" >
            Summary
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="dataViewTab">
          <v-tab-item :value="'tab-live-feed'" >
            <feed-view
              :dropsFromDrf="dropsFromDrf"
            />
          </v-tab-item>
          <v-tab-item :value="'tab-summary'">
            <summary-view
              :dropsFromDrf="dropsFromDrf"
            />
          </v-tab-item>
        </v-tabs-items>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FeedView from '../components/LiveTracker/FeedView.vue';
import SummaryView from '../components/LiveTracker/SummaryView.vue';
export default {
  name: "DataRecordDetail",
  components: {
    SummaryView,
    FeedView
  },
  data() {
    return {
      dataViewTab: "tab-live-feed",
      dropsFromDrf: [],
      dropBuffer: [],
      drfWebSocket: null,
      bufferTimer: null
    };
  },
  computed:{
    // sortedDrops() {
    //   const result = [...this.dropsFromDrf]
    //   result.sort((a, b) => b.timestamp - a.timestamp);
    //   return result
    // }
  },
  methods: {
    sortDrops(){
      this.dropsFromDrf.sort((a, b) => b.timestamp - a.timestamp);
    },
    addBufferToView() {
      if (this.bufferTimer) {
        return // wait for timer
      }
      else if (this.dropBuffer.length > 0) {
        this.dropsFromDrf.unshift(...this.dropBuffer)
        this.dropBuffer = []
        this.startBufferTimer()
      }
      else {
        return
      }
      //if buffer timer is set, do nothing
      //if unset, add buffer to view and startBufferTimer
    },
    startBufferTimer() {
      this.bufferTimer = setTimeout((() => {
        this.bufferTimer = null
        this.addBufferToView()
      }).bind(this), 5000)
    }
  },
  created() {
    this.drfWebSocket = new WebSocket("wss://drf.gw2.dev/ws");
    this.drfWebSocket.onmessage = (event) => {
      this.dropBuffer.unshift(JSON.parse(event.data));
      this.addBufferToView()
    };
  },
  destroyed() {
    this.drfWebSocket.close();
  },
};
</script>

<style></style>
