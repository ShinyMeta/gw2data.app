<template>
  <div class="StateViewerFromApi">
    <StateViewer 
      :accountState="accountState"
      :currencyLookup="currencyLookup"
      :itemLookup="itemLookup"
      :materialStorageDetails="materialStorageDetails"
      />

  </div>
</template>

<script>
import StateViewer from './StateViewer'


export default {
  name: 'StateViewerFromApi',
  components: {
    StateViewer
    
  },
  props: {
    api: Object,
    apikeyAuthenticated: Boolean,
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
      accountState: {
        wallet:[],
        bank:[],
        materialStorage:{},
        sharedInventory:[],
        characters:[],
      },
      currencyLookup:{},
      itemLookup:{},
      materialStorageDetails:[]
    }
  },
  
  methods:{
    getState() {
      //Wallet
      this.api.account().wallet().get().then((wallet) => {
        this.accountState.wallet = wallet
      })
      //Bank
      this.api.account().bank().get().then((bank) => {
        this.accountState.bank = bank
        //request details from all new items
        let itemIDSet = new Set()
        bank.forEach((bankSlot) => {
          if (bankSlot) { itemIDSet.add(bankSlot.id) }
        })
        this.getItemsForLookup(Array.from(itemIDSet))
      })
      //Material Storage
      this.api.account().materials().get().then((materialStorage) => {
        //create matstorage lookup
        let newMatStorage = {
          raw: materialStorage,
          itemidLookup: {}
        }
        materialStorage.forEach((material) => {
          newMatStorage.itemidLookup[material.id] = material
        })
        this.accountState.materialStorage = newMatStorage
        //request details from all new items
        let itemIDSet = new Set()
        materialStorage.forEach((material) => {
          itemIDSet.add(material.id)
        })
        this.getItemsForLookup(Array.from(itemIDSet))
      })
      //shared inventory
      this.api.account().inventory().get().then((sharedInventory) => {
        this.accountState.sharedInventory = sharedInventory
        //request details from all new items
        let itemIDSet = new Set()
        sharedInventory.forEach((sharedSlot) => {
          if (sharedSlot) { itemIDSet.add(sharedSlot.id) }
        })
        this.getItemsForLookup(Array.from(itemIDSet))
      })
      //character inventories
      this.api.account().characters().all().then((characters) => {
        this.accountState.characters = characters
        //request details from all new items
        let itemIDSet = new Set()
        this.forEachItemInCharactersInventory(characters, (item) => {
          itemIDSet.add(item.id)
        })
        this.getItemsForLookup(Array.from(itemIDSet))
      })
    },

    getCurrenciesForLookup(){
      this.api.currencies().all().then((currencies) => {
        let newCurrencies = {}
        currencies.forEach((currency) => {
          newCurrencies[currency.id] = currency
        })
        this.currencyLookup = Object.assign({}, this.currencyLookup, newCurrencies)
      })
    },

    getMaterialStorageDetails(){
      this.api.materials().all().then((materialStorageDetails) => {
        materialStorageDetails.sort((a, b) => a.order - b.order)
        this.materialStorageDetails = materialStorageDetails
      })
    },

    getItemsForLookup(ids) {
      console.log(ids)
      this.api.items().many(ids).then((items) => {
        let newItems = {}
        items.forEach((item) => {
          this.itemLookup[item.id] = item
        })
        this.itemLookup = Object.assign({}, this.itemLookup, newItems)
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