<template>
  <div class="StateViewer">
    <div>
    <input type="radio" v-model="selectedTab" value="wallet"/>
    <label for="wallet"> Wallet </label>
    <input type="radio" v-model="selectedTab" value="bank"/>
    <label for="bank"> Bank </label>
    <input type="radio" v-model="selectedTab" value="materialStorage"/>
    <label for="materialStorage"> Material Storage </label>
    <input type="radio" v-model="selectedTab" value="sharedInventory"/>
    <label for="sharedInventory"> Shared Inventory </label>
    <input type="radio" v-model="selectedTab" value="characters"/>
    <label for="characters"> Characters </label>

    </div>
    <StateViewerWallet v-if="selectedTab==='wallet'"/>
    <StateViewerBank v-if="selectedTab==='bank'"/>
    <StateViewerMaterialStorage v-if="selectedTab==='materialStorage'"/>
    <StateViewerSharedInventory v-if="selectedTab==='sharedInventory'"/>
    <StateViewerAllCharacters v-if="selectedTab==='characters'"/>

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