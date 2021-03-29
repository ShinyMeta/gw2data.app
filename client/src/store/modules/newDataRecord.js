

export default {
  namespaced: true,

  state: {
    newDataRecord: {
      user_id: null,
      gw2_account_name: null,
      start_time: null,
      end_time: null,
      // status: 'saved', //other statuses: edited, 
      description: null,
      details: null,
      primary_tag: null,
      primary_element_id: null,
      primary_element_type: null,
    },
    newDataRecordLines: [],

  }, 



  getters: {
    newDataRecord: state => state.newDataRecord,
    newDataRecordLines: state => state.newDataRecordLines,
    newDataRecordLinesWithElementDetails: (state, getters, rootState, rootGetters) => {
      const result = [...state.newDataRecordLines]
      result.forEach(x => {
        if (x.element_type === "Item") {
          if (rootGetters.itemLookup[x.element_id]){
            x.name = rootGetters.itemLookup[x.element_id].name
            x.icon = rootGetters.itemLookup[x.element_id].icon 
            x.type = rootGetters.itemLookup[x.element_id].type 
          }
          else {
            x.name = 'Loading...'
          }
        }
        if (x.element_type === "Currency") {
          if (rootGetters.currencyLookup[x.element_id]){
            x.name = rootGetters.currencyLookup[x.element_id].name 
            x.icon = rootGetters.currencyLookup[x.element_id].icon 
            x.type = "Currency"
          }
          else {
            x.name = 'Loading...'
          }
        }
      })
      return result
    }

  }, 



  actions: {
    updateNewDataRecord({commit}, newValues) {
      commit('updateNewDataRecord', newValues)
    },
    
    // setUser({commit}, user_id) {
    //   commit('setNewDataRecordX', 'user_id', user_id)
    // },
    // setAccName({commit}, gw2_account_name) {
    //   commit('setNewDataRecordX', 'gw2_account_name', gw2_account_name)
    // },
    
    setNewDataRecordLines({commit}, lines) {
      commit('setNewDataRecordLines', lines) 
    }
  }, 


  
  mutations: {
    updateNewDataRecord(state, newValues) {
      Object.keys(state.newDataRecord).forEach((key) => {
        if (newValues[key]) {
          state.newDataRecord[key] =  newValues[key]
        }
      })
    },
    setNewDataRecordX(state, X, value) {
      state.newDataRecord[X] = value
    },
    setNewDataRecordLines(state, lines) {
      state.newDataRecordLines = lines
    }
  }

}




