<template>
  <div class="home">
    <span> Enter API Key: </span>
    <input type="text" v-model="apikey" />
    <button @click="getState"> Request Account State </button>

    <StateViewer :accountState="accountState"/>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import StateViewer from '@/components/StateViewer.vue'
const client = require('gw2api-client')

// Get an instance of an API client
let api = client()

export default {
  name: 'Home',
  components: {
    StateViewer
  },
  data() {
    return {
      apikey: 'CFBA11E8-CDAD-144E-82DF-1F3E8E1D7D855C321BCE-88F2-46D5-A27F-0DA6FC88F39A',
      accountState: {
        wallet:{},
        bank:{},
        materialStorage:{},
        sharedInventory:{},
        characters:{}
      }
    }
  },
  methods:{
    getState() {
      api.authenticate(this.apikey)

      api.account().wallet().get().then((wallet) => {
        this.accountState.wallet = wallet
      })
      api.account().bank().get().then((bank) => {
        this.accountState.bank = bank
      })
      api.account().materials().get().then((materialStorage) => {
        this.accountState.materialStorage = materialStorage
      })
      api.account().inventory().get().then((sharedInventory) => {
        this.accountState.sharedInventory = sharedInventory
      })
      api.account().characters().all().then((characters) => {
        this.accountState.characters = characters
      })

      return ""
    }
  }
}
</script>
