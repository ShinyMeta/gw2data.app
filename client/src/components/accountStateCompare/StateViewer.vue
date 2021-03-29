<template>
  <div class="StateViewer">

    <v-tabs
      v-model="selectedTab"
      centered
    >
      <v-tab :href="'#wallet'" >
        Wallet
      </v-tab>
      <v-tab :href="'#bank'" >
        Bank
      </v-tab>
      <v-tab :href="'#materialStorage'" >
        Material Storage
      </v-tab>
      <v-tab :href="'#sharedInventory'" >
        Shared Inventory
      </v-tab>
      <v-tab :href="'#characters'" >
        Characters
      </v-tab>

    </v-tabs>


    <v-tabs-items v-model="selectedTab">
      <v-tab-item :value="'wallet'">
        <StateViewerWallet v-if="selectedTab==='wallet'"
          :wallet="accountState.wallet" 
          :currencyLookup="currencyLookup"
          />
      </v-tab-item>
      <v-tab-item :value="'bank'" >
        <StateViewerBank v-if="selectedTab==='bank'"
          :bank="accountState.bank" 
          :itemLookup="itemLookup"
          />
      </v-tab-item>
      <v-tab-item :value="'materialStorage'" >
        <StateViewerMaterialStorage v-if="selectedTab==='materialStorage'"
          :materialStorage="accountState.materialStorage" 
          :itemLookup="itemLookup"
          :materialStorageDetails="materialStorageDetails"
          />
      </v-tab-item>
      <v-tab-item :value="'sharedInventory'" >
        <StateViewerSharedInventory v-if="selectedTab==='sharedInventory'"
          :sharedInventory="accountState.sharedInventory" 
          :itemLookup="itemLookup"
          />
      </v-tab-item>
      <v-tab-item :value="'characters'" >
        <StateViewerAllCharacters v-if="selectedTab==='characters'"
          :characters="accountState.characters" 
          :itemLookup="itemLookup"
          />
      </v-tab-item>
    </v-tabs-items>


    
    
    
    

  </div>
</template>

<script>
import StateViewerBank from './StateViewerBank'
import StateViewerAllCharacters from './StateViewerAllCharacters'
import StateViewerMaterialStorage from './StateViewerMaterialStorage'
import StateViewerSharedInventory from './StateViewerSharedInventory'
import StateViewerWallet from './StateViewerWallet'

import {mapGetters} from 'vuex'

export default {
  name: 'StateViewer',
  components: {
    StateViewerBank,
    StateViewerAllCharacters,
    StateViewerMaterialStorage,
    StateViewerSharedInventory,
    StateViewerWallet
    
  },
  props: {
    accountState: Object,
    currencyLookup: Object,
    itemLookup: Object,
    materialStorageDetails: Array
  },
  data() {
    return {
      selectedTab: "wallet"
    }
  },
  computed: {
    ...mapGetters([
      // 'accountState',
      // 'itemLookup',
      // 'currencyLookup',
      // 'materialStorageDetails'
    ])
  }
}
</script>

<style>
.StateViewer {
  display: inline;
  width: 640px;
}
</style>