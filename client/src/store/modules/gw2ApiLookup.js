

const client = require('gw2api-client')
const api = client()

// const fetchPromises = []


export default {
  state: {
    currencyLookup:{},
    itemLookup:{},
    materialStorageDetails:[],
    lookupsLoading: true
  }, 



  getters: {
    itemLookup: state => state.itemLookup,
    currencyLookup: state => state.currencyLookup,
    materialStorageDetails: state => state.materialStorageDetails,
    lookupsLoading: state => state.lookupsLoading,
    
    elementLookup(state) {
      return {
        Item: state.itemLookup,
        Currency: state.currencyLookup,
      }
    },

    lookupElementDetails(state) { // technically returns a function that can be used to lookup an element
      return ({type, id}) => { // given type and id, returns the element from the correct lookup
        if (type === "Item") { // aaaaaand I'm dumb, use above elementLookup[type][id]
          return state.itemLookup[id]
        }
        else if (type === "Currency") {
          return state.currencyLookup[id]
        }
        else {
          return null
        }
      }
    },
  }, 






  actions: {
    
    addItemsToLookupFromApi({commit,state}, ids){
      //filter out ids already in lookup
      const idsToFetch = ids.filter(x => !state.itemLookup[x])
      if (idsToFetch.length === 0) { // all items already fetched
        return
      }

      return fetchItemsForLookup(idsToFetch)
        .then((items) => {
          commit('addItemsToLookup', items)
        })
    },

    loadCurrencyLookupFromApi({commit, state }){
      if (state.currencyLookup[1]) { // currencies already fetched
        return 
      }
      return fetchCurrenciesForLookup()
        .then((currencies) => {
          commit('setCurrencyLookup', currencies)
        })
    },

    loadMaterialStorageDetailsFromApi({commit}){
      return fetchMaterialStorageDetails()
        .then((materialStorageDetails) => {
          commit('setMaterialStorageDetails', materialStorageDetails)
        })
    },


  }, 





  
  mutations: {

    addItemsToLookup(state, newItems) {
      state.itemLookup = Object.assign({}, state.itemLookup, newItems)
    },
    setCurrencyLookup(state, currencyLookup) {
      state.currencyLookup = currencyLookup
    },
    setMaterialStorageDetails(state, materialStorageDetails){
      state.materialStorageDetails = materialStorageDetails
    }

  }
}







function fetchCurrenciesForLookup(){
  return api.currencies().all().then((currencies) => {
    let newCurrencies = {}
    currencies.forEach((currency) => {
      newCurrencies[currency.id] = currency
    })
    return newCurrencies
  })
}


function fetchMaterialStorageDetails(){
  return api.materials().all().then((materialStorageDetails) => {
    materialStorageDetails.sort((a, b) => a.order - b.order)
    return  materialStorageDetails
  })
}


function fetchItemsForLookup(ids) {
  // console.log(ids)
  return api.items().autoBatch().many(ids).then((items) => {
    let newItems = {}
    items.forEach((item) => {
      newItems[item.id] = item
    })
    return newItems
  })
}

