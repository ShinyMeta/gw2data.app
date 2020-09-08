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
    api: Object,
    apikeyAuthenticated: Boolean,
    // accountState: Object,
    // currencyLookup: Object,
    // itemLookup: Object
  },
  watch: {
    apikeyAuthenticated (apikeyAuthenticated_new, apikeyAuthenticated_old)  {
      if (apikeyAuthenticated_new && !apikeyAuthenticated_old) {
          this.getState()
        } 
    }
  },
  data() {
    return {
      selectedTab: "wallet",

      accountState: {
        wallet:[],
        bank:[],
        materialStorage:[],
        sharedInventory:[],
        characters:[],
      },
      currencyLookup:{},
      itemLookup:{},
      materialStorageDetails:{}
    }
  },
  
  methods:{
    getState() {
      // this.api.authenticate(this.apikey)

      this.api.account().wallet().get().then((wallet) => {
        this.accountState.wallet = wallet
        // console.log("wallt:")
        // console.log(wallet)
      })
      this.api.account().bank().get().then((bank) => {
        this.accountState.bank = bank

            let itemIDSet = new Set()
            bank.forEach((bankSlot) => {
              if (bankSlot) { itemIDSet.add(bankSlot.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("bank:")
        // console.log(bank)
      })
      this.api.account().materials().get().then((materialStorage) => {
        this.accountState.materialStorage = materialStorage

            let itemIDSet = new Set()
            materialStorage.forEach((material) => {
              if (material) { itemIDSet.add(material.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("matStore:")
        // console.log(materialStorage)
      })
      this.api.account().inventory().get().then((sharedInventory) => {
        this.accountState.sharedInventory = sharedInventory

            let itemIDSet = new Set()
            sharedInventory.forEach((sharedSlot) => {
              if (sharedSlot) { itemIDSet.add(sharedSlot.id) }
            })
            this.getItemsForLookup(Array.from(itemIDSet))

        // console.log("shared slotes:")
        // console.log(sharedInventory)
      })
      this.api.account().characters().all().then((characters) => {
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
      this.api.currencies().all().then((currencies) => {
        // console.log("currencies:")
        // console.log(currencies)
        currencies.forEach((currency) => {
          this.currencyLookup[currency.id] = currency
        })
      })
    },

    getMaterialStorageDetails(){
      this.api.materials().all().then((materialStorageDetails) => {
        console.log("materialStorageDetails:")
        console.log(materialStorageDetails)
        this.materialStorageDetails = materialStorageDetails
      })
    },

    getItemsForLookup(ids) {
      console.log(ids)
      this.api.items().many(ids).then((items) => {
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
    this.getMaterialStorageDetails()
  }

}
</script>

<style>

</style>