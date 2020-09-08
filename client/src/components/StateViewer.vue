<template>
  <div class="StateViewer">
    <div>
      <input type="radio" v-model="selectedTab" value="wallet" id="wallet"/>
        <label for="wallet"> Wallet </label>
      <input type="radio" v-model="selectedTab" value="bank" id="bank"/>
        <label for="bank"> Bank </label>
      <input type="radio" v-model="selectedTab" value="materialStorage" id="materialStorage"/>
        <label for="materialStorage"> Material Storage </label>
      <input type="radio" v-model="selectedTab" value="sharedInventory" id="sharedInventory"/>
        <label for="sharedInventory"> Shared Inventory </label>
      <input type="radio" v-model="selectedTab" value="characters" id="characters"/>
        <label for="characters"> Characters </label>
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
      />
    <StateViewerAllCharacters v-if="selectedTab==='characters'"
      />

  </div>
</template>

<script>
import StateViewerBank from './StateViewerBank'
import StateViewerAllCharacters from './StateViewerAllCharacters'
import StateViewerMaterialStorage from './StateViewerMaterialStorage'
import StateViewerSharedInventory from './StateViewerSharedInventory'
import StateViewerWallet from './StateViewerWallet'
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
  }
}
</script>

<style>
</style>