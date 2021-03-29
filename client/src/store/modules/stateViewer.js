

const client = require('gw2api-client')
const api = client()


export default {
  state: {
    apiKey:'',
    accountStateFromApi: AccountState(),
    accountStateFromSave: AccountState(),
    // currencyLookup:{},
    // itemLookup:{},
    // materialStorageDetails:[]
  }, 



  getters: {
    accountStateFromApi: state => state.accountStateFromApi,
    accountStateFromSave: state => state.accountStateFromSave,
    itemTotalsFromApi: state => getItemTotalsFromAccountState(state.accountStateFromApi),
    itemTotalsFromSave: state => getItemTotalsFromAccountState(state.accountStateFromSave),
    // itemLookup: state => state.itemLookup,
    // currencyLookup: state => state.currencyLookup,
    // materialStorageDetails: state => state.materialStorageDetails,

  }, 






  actions: {
    

    fetchAccountStateFromGW2Api({commit, dispatch}, apikey) {
      let accountStateFromApi = AccountState()

      return setApiKey(apikey).then(() => {
        return Promise.all([
          //Wallet
          api.account().wallet().get().then((wallet) => {
            accountStateFromApi.wallet = wallet
          }),
          //Bank
          api.account().bank().get().then((bank) => {
            accountStateFromApi.bank = bank
          }),
          //Material Storage
          api.account().materials().get().then((materialStorage) => {
            //create matstorage lookup
            let newMatStorage = {
              raw: materialStorage,
              itemidLookup: {}
            }
            materialStorage.forEach((material) => {
              newMatStorage.itemidLookup[material.id] = material
            })
            accountStateFromApi.materialStorage = newMatStorage
          }),
          //shared inventory
          api.account().inventory().get().then((sharedInventory) => {
            accountStateFromApi.sharedInventory = sharedInventory
          }),
          //character inventories
          api.account().characters().all().then((characters) => {
            accountStateFromApi.characters = characters
          })
        ]).then(() => {
          commit('setAccountStateFromApi', accountStateFromApi)
          return dispatch('extractItemIdsFromAccountStateforLookup', accountStateFromApi)
        }).catch(console.err)
      })
    },
    clearAccountStates({commit}) {
      commit('clearAccountStateFromApi')
      commit('clearAccountStateFromSave')
    },
    setAccountStateFromApi({commit, dispatch}, accountStateFromApi) {
      commit('setAccountStateFromApi', accountStateFromApi)
      return dispatch('extractItemIdsFromAccountStateforLookup', accountStateFromApi)
    },

    setAccountStateFromSave({commit, dispatch}, accountStateFromSave) {
      commit('setAccountStateFromSave', accountStateFromSave)
      return dispatch('extractItemIdsFromAccountStateforLookup', accountStateFromSave)
    },

    // addItemsToLookupFromApi({commit}, ids){
    //   return fetchItemsForLookup(ids)
    //     .then((items) => {
    //       commit('addItemsToLookup', items)
    //     })
    // },

    // loadCurrencyLookupFromApi({commit}){
    //   return fetchCurrenciesForLookup()
    //     .then((currencies) => {
    //       commit('setCurrencyLookup', currencies)
    //     })
    // },

    // loadMaterialStorageDetailsFromApi({commit}){
    //   return fetchMaterialStorageDetails()
    //     .then((materialStorageDetails) => {
    //       commit('setMaterialStorageDetails', materialStorageDetails)
    //     })
    // },

    extractItemIdsFromAccountStateforLookup({dispatch, state}, accountState){
      let itemIDSet = new Set()
      if (!accountState) {
        accountState = state.accountStateFromApi
      }
      //Bank
      accountState.bank.forEach((bankSlot) => {
        if (bankSlot) { 
          itemIDSet.add(bankSlot.id) 
          if (bankSlot.upgrades)  {  bankSlot.upgrades.forEach(x => itemIDSet.add(x)) }
          if (bankSlot.infusions) { bankSlot.infusions.forEach(x => itemIDSet.add(x)) }
        }
      })
      //Material Storage
      accountState.materialStorage.raw.forEach((material) => {
        itemIDSet.add(material.id)
      })
      //Shared Inventory
      accountState.sharedInventory.forEach((sharedSlot) => {
        if (sharedSlot) { 
          itemIDSet.add(sharedSlot.id) 
          if (sharedSlot.upgrades)  {  sharedSlot.upgrades.forEach(x => itemIDSet.add(x)) }
          if (sharedSlot.infusions) { sharedSlot.infusions.forEach(x => itemIDSet.add(x)) }
        }
      })
      //character inventories
      forEachItemInCharactersInventory(accountState.characters, (item) => {
        itemIDSet.add(item.id)
        if (item.upgrades)  {  item.upgrades.forEach(x => itemIDSet.add(x)) }
        if (item.infusions) { item.infusions.forEach(x => itemIDSet.add(x)) }
      })
      return dispatch('addItemsToLookupFromApi', Array.from(itemIDSet))
    },

  }, 





  
  mutations: {
    setApiKey (state, apiKey) {
      state.apiKey = apiKey
    },
    setAccountStateFromApi: (state, accountState) => {
      state.accountStateFromApi = accountState
    },
    setAccountStateFromSave: (state, accountState) => {
      state.accountStateFromSave = accountState
    },
    
    clearAccountStateFromApi(state){
      state.accountStateFromApi = AccountState()
    },
    clearAccountStateFromSave(state){
      state.accountStateFromSave = AccountState()
    },

    // addItemsToLookup(state, newItems) {
    //   state.itemLookup = Object.assign({}, state.itemLookup, newItems)
    // },
    // setCurrencyLookup(state, currencyLookup) {
    //   state.currencyLookup = currencyLookup
    // },
    // setMaterialStorageDetails(state, materialStorageDetails){
    //   state.materialStorageDetails = materialStorageDetails
    // }

  }
}







// function fetchCurrenciesForLookup(){
//   return api.currencies().all().then((currencies) => {
//     let newCurrencies = {}
//     currencies.forEach((currency) => {
//       newCurrencies[currency.id] = currency
//     })
//     return newCurrencies
//   })
// }
// function fetchMaterialStorageDetails(){
//   return api.materials().all().then((materialStorageDetails) => {
//     materialStorageDetails.sort((a, b) => a.order - b.order)
//     return  materialStorageDetails
//   })
// }
// function fetchItemsForLookup(ids) {
//   // console.log(ids)
//   return api.items().many(ids).then((items) => {
//     let newItems = {}
//     items.forEach((item) => {
//       newItems[item.id] = item
//     })
//     return newItems
//   })
// }
    






function forEachItemInCharactersInventory(characters, forEachCallback) {
  characters.forEach((character) => {
    const characterName = character.name
    character.bags.forEach((bag) => { if(bag) {
      bag.inventory.forEach((bagInventorySlot) => { if (bagInventorySlot) {
        forEachCallback(bagInventorySlot, characterName)
      }})
    } })
  })
}

function AccountState() {
  return   {
    wallet:[],
    bank:[],
    materialStorage:{},
    sharedInventory:[],
    characters:[],
    timestampOfState: new Date(Date.now()),
  }
}

function getItemTotalsFromAccountState(accountState) {
  if (accountState.wallet.length === 0) { return null }
  let itemTotals = {}

  function addItemToTotals(item, source) {
    let id = `${item.id}`
    const count = item.count
    let upgrades = []
    if (item.upgrades) { upgrades = upgrades.concat(item.upgrades) }
    if (item.infusions) { upgrades = upgrades.concat(item.infusions) }
    if (upgrades.length > 0) {
      upgrades.sort((a, b) => a - b) // lowest id first
      id = `${id}_${upgrades.join('_')}`
    }
    if (itemTotals[id]) {
      itemTotals[id].count += count
      itemTotals[id].sources.push(`${count} in ${source}`)
    }
    else {
      itemTotals[id] = {
        count,
        sources: [
          `${count} in ${source}`
        ]
      }
    }
  }


  //Bank
  accountState.bank.forEach((bankSlot) => {
    if (bankSlot) { addItemToTotals(bankSlot, 'Bank') }
  })
  //Material Storage
  accountState.materialStorage.raw.forEach((material) => {
    addItemToTotals(material, "Material Storage")
  })
  //Shared Inventory
  accountState.sharedInventory.forEach((sharedSlot) => {
    if (sharedSlot) { addItemToTotals(sharedSlot, "Shared Inventory") }
  })
  //character inventories
  forEachItemInCharactersInventory(accountState.characters, (item, characterName) => {
    addItemToTotals(item, characterName)
  })
  
  return itemTotals
}



function setApiKey(apiKey) {
  api.authenticate(apiKey)
  return api.account().get()
    .then(() => {
      // this.apikeyAuthenticated = true
      return true
    })
    .catch((err) => {
      alert('API Key did not Authenticate successfully.  Please try again.')
      console.error(err)
      return false
      // this.apikeyAuthenticated = false
    })
}