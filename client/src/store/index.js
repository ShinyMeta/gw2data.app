import Vue from 'vue'
import Vuex from 'vuex'
import gw2ApiLookup from './modules/gw2ApiLookup'
import stateViewer from './modules/stateViewer'
import activeUser from './modules/activeUser'
import newDataRecord from './modules/newDataRecord'
import dataRecords from './modules/dataRecords'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    gw2ApiLookup,
    stateViewer,
    activeUser,
    newDataRecord,
    dataRecords,
  }
})
