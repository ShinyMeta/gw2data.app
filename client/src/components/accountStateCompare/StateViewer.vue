<template>
  <div class="StateViewer">
    <div>
      <label><input type="radio" v-model="selectedTab" value="wallet" id="wallet"/>
        Wallet </label>
      <label><input type="radio" v-model="selectedTab" value="bank" id="bank"/>
        Bank </label>
      <label><input type="radio" v-model="selectedTab" value="materialStorage" id="materialStorage"/>
        Material Storage </label>
      <label><input type="radio" v-model="selectedTab" value="sharedInventory" id="sharedInventory"/>
        Shared Inventory </label>
      <label><input type="radio" v-model="selectedTab" value="characters" id="characters"/>
        Characters </label>
    </div>





    <StateViewerWallet v-if="selectedTab==='wallet'" 
      :wallet="accountState.wallet" 
      :currencyLookup="currencyLookup"
      />
    <StateViewerBank v-if="selectedTab==='bank'"
      :bank="accountState.bank" 
      :itemLookup="itemLookup"
      />
    <StateViewerMaterialStorage v-if="selectedTab==='materialStorage'"
      :materialStorage="accountState.materialStorage" 
      :itemLookup="itemLookup"
      :materialStorageDetails="materialStorageDetails"
      />
    <StateViewerSharedInventory v-if="selectedTab==='sharedInventory'"
      :sharedInventory="accountState.sharedInventory" 
      :itemLookup="itemLookup"
      />
    <StateViewerAllCharacters v-if="selectedTab==='characters'"
      :characters="accountState.characters" 
      :itemLookup="itemLookup"
      />

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