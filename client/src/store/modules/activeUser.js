
import axios from 'axios'



export default {
  state: {
    user: {
      username: null,
      id: null,
      email: null
    },
    apikeys: [],
    selectedApiKey: null
    
  },

  getters: {
    user: state => state.user,
    apikeys: state => state.apikeys,
    selectedApiKey: state => state.selectedApiKey,
  },

  actions: {
    setUser({commit}, user) {
      commit('setUser', user)
    },

    userWasLoggedOut({commit}) {
      commit('setUser', {
        username: null,
        id: null,
        email: null
      })
    },

    getUserFromSession({commit, state}) {
      if (state.user.username !== null) { 
        return Promise.resolve(state.user) 
      }
      return axios.get(`/api/auth/user`)
        .then((response) => {
          if (response.data !== null) {
            commit('setUser', response.data)
            return true
          }
          else {
            return Promise.reject('not logged in')
          }
        })
    },

    getApiKeysFromUser({commit, state}) {
      if (state.user.username === null) { 
        return Promise.reject('no user in state')
      }
      
      return axios.get(`/api/account/apikeys`)
        .then((response) => {
          if (response.data !== null) {
            console.log(response.data)
            // window.alert('got apikeys')
            commit('setApiKeys', response.data)
            return true
          }
          else {
            return false
          }
        }).catch(console.error)

    },

    clearApiKeys({commit}) {
      commit('clearApiKeys')
    },

    addApiKey({commit}, apikey) {
      commit('addApiKey', apikey)
    },

    deleteApiKey({commit}, apikey) {
      commit('deleteApiKey', apikey)
    },

    selectApiKey({commit, state}, apikey) {
      if (apikey.apikey) {// can pass in apikey object or string
        apikey = apikey.apikey
      }
      const index = state.apikeys.findIndex(x => x.apikey === apikey)
      if (index !== -1) {
        commit('setSelectedApiKey', state.apikeys[index])
      }
    },
    deselectApiKey({commit}) {
      commit('deselectApiKey')
    },

  },

  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setApiKeys(state, apikeys) {
      state.apikeys = apikeys
    },
    clearApiKeys(state) {
      state.apikeys = []
    },
    addApiKey(state, apikey) {
      state.apikeys.push(apikey)
    },
    deleteApiKey(state, apikey) {
      if (apikey.apikey) {// can pass in apikey object or string
        apikey = apikey.apikey
      }
      const index = state.apikeys.findIndex(x => x.apikey === apikey)
      if (index !== -1) {
        state.apikeys.splice(index,1)
      }
    },
    setSelectedApiKey(state, apiKey) {
      state.selectedApiKey = apiKey
    },
    deselectApiKey(state) {
      state.selectedApiKey = null
    }
  }


}