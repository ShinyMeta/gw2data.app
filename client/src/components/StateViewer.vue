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
    <div v-else>not wallet</div>
  </div>
</template>

<script>
import StateViewerWallet from './StateViewerWallet'

export default {
  name: 'StateViewer',
  components: {
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