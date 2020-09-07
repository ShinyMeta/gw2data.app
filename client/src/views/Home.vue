<template>
  <div class="home">
    <span> Enter API Key: </span>
    <input type="text" v-model="apikey" />
    <button @click="getState"> Request Account State </button>

    <StateViewer 
      :accountState="accountState"
      :currencyLookup="currencyLookup"
      :itemLookup="itemLookup"
      />
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
        wallet:[],
        bank:[],
        materialStorage:[],
        sharedInventory:[],
        characters:[],
      },
      currencyLookup:{},
      itemLookup:{}
    }
  },
  methods:{
    getState() {
      api.authenticate(this.apikey)

      api.account().wallet().get().then((wallet) => {
        this.accountState.wallet = wallet
        // console.log("wallt:")
        // console.log(wallet)
      })
      api.account().bank().get().then((bank) => {
        this.accountState.bank = bank

            let itemIDSet = new Set()
            bank.forEach((bankSlot) => {
              if (bankSlot) { itemIDSet.add(bankSlot.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("bank:")
        // console.log(bank)
      })
      api.account().materials().get().then((materialStorage) => {
        this.accountState.materialStorage = materialStorage

            let itemIDSet = new Set()
            materialStorage.forEach((material) => {
              if (material) { itemIDSet.add(material.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("matStore:")
        // console.log(materialStorage)
      })
      api.account().inventory().get().then((sharedInventory) => {
        this.accountState.sharedInventory = sharedInventory

            let itemIDSet = new Set()
            sharedInventory.forEach((sharedSlot) => {
              if (sharedSlot) { itemIDSet.add(sharedSlot.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("shared slotes:")
        // console.log(sharedInventory)
      })
      api.account().characters().all().then((characters) => {
        this.accountState.characters = characters

            let itemIDSet = new Set()
            this.forEachItemInCharactersInventory(characters, (item) => {
              itemIDSet.add(item.id)
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("chars:")
        // console.log(characters)
      })
    },

    getCurrenciesForLookup(){
      api.currencies().all().then((currencies) => {
        // console.log("currencies:")
        // console.log(currencies)
        currencies.forEach((currency) => {
          this.currencyLookup[currency.id] = currency
        })
      })
    },

    getItemsForLookup(ids) {
      console.log(ids)
      api.items().many(ids).then((items) => {
        // console.log("items:\n")
        // console.log(items)
        items.forEach((item) => {
          this.itemLookup[item.id] = item
        })
      })
    },

    forEachItemInCharactersInventory(characters, forEachCallback) {
      characters.forEach((character) => {
        character.bags.forEach((bag) => { if(bag) {
          bag.inventory.forEach((bagInventorySlot) => { if (bagInventorySlot) {
            forEachCallback(bagInventorySlot)
          }})
        } })
      })
    }
  },

  mounted() {
    this.getCurrenciesForLookup()
  }

}
</script>
