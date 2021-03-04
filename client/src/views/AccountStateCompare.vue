<template>
  <div class="AccountStateCompare">
    <iframe hidden=true name="dummyFormSubmitTargetFrame"></iframe>
    <br/>
    <!-- <form> -->
    <form action="javascript:" target="dummyFormSubmitTargetFrame">
      <!-- <span> Select API Key: </span> -->
      <!-- <input type="text" 
        v-model="apikey"
        pattern="[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{20}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}"
        id="apikeyInput"
        ref="apikeyInput"
        /> -->
      <select v-model="selectedApiKeyOption" :disabled="selectedApiKey !== null">
        <option value="default" disabled>Select an API Key</option>
        <option v-for="(apikey, index) in apikeys"
          :key="`apikey_${index}`" 
          :value="apikey.apikey"
          >{{apikey.account_name}}-{{apikey.apikey}}</option>
      </select>
      <button @click="useSelectedApiKey" v-if="selectedApiKey === null"> Use this API Key </button>
      <button @click="useDifferentApiKey" v-if="selectedApiKey !== null"> Use Different API Key</button>
        <br/>
      <button type="submit" @click="fetchBothStates" v-if="selectedApiKey !== null"> Refresh Account States </button>
        <br/>
      <button type="submit" @click="saveState" v-if="accountStateFromApi.wallet.length > 0"> Copy Live State to Save </button>
        <!-- <br/>
      <button type="submit" @click="loadState"> Load Account State </button> -->
    </form>
    <div>
      <label><input type="radio" v-model="statesOrDiff" value="states" id="states"/>
        Live and Saved State </label>
      <label><input type="radio" v-model="statesOrDiff" value="diff" id="diff"/>
        Differences </label>
    </div>

    <div id="stateViewers" v-if="statesOrDiff==='states'" >
      <div>
        <h1>Live State From API</h1>
        <StateViewer
          :accountState="accountStateFromApi"
          :currencyLookup="currencyLookup"
          :itemLookup="itemLookup"
          :materialStorageDetails="materialStorageDetails"
          />
      </div>
      <div>
        <h1>Saved State</h1>
        <StateViewer
          :accountState="accountStateFromSave"
          :currencyLookup="currencyLookup"
          :itemLookup="itemLookup"
          :materialStorageDetails="materialStorageDetails"
          />
      </div>
    </div>
    <div id="diffViewer" v-if="statesOrDiff==='diff'">
      <AccountStateDiff
        v-if="accountStateFromApi.wallet.length > 0 && accountStateFromSave.wallet.length > 0" 
        />
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import StateViewer from '@/components/accountStateCompare/StateViewer.vue'
import AccountStateDiff from '@/components/accountStateCompare/AccountStateDiff.vue'
// const client = require('gw2api-client')
import {mapGetters, mapActions} from 'vuex'

// Get an instance of an API client

export default {
  name: 'AccountStateCompare',
  components: {
    StateViewer,
    AccountStateDiff,
    // AccountControls,
  },
  data() {
    return {
      // api: client(),
      selectedApiKeyOption: 'default',
      apikeyAuthenticated: false,
      statesOrDiff: 'states'
    }
  },
  methods:{
    ...mapActions([
      'fetchAccountStateFromGW2Api',
      'selectApiKey',
      'deselectApiKey',
      'loadCurrencyLookupFromApi',
      'loadMaterialStorageDetailsFromApi',
      'setAccountStateFromApi',
      'setAccountStateFromSave',
      'clearAccountStates',
    ]),
    useSelectedApiKey() {
      this.selectApiKey(this.selectedApiKeyOption)
        .then(this.fetchBothStates)
    },
    useDifferentApiKey() {
      this.deselectApiKey()
      this.clearAccountStates()
    },
    saveState() {

      this.$axios.post(`/api/accountState/${this.selectedApiKey.apikey}`, this.accountStateFromApi)
        .then((result) => {
          console.log(result) 
          return this.setAccountStateFromSave(this.accountStateFromApi)
        })
      
    },
    loadState() {
      return this.$axios.get(`/api/accountState/${this.selectedApiKey.apikey}`)
        .then((response) => {
          let accountState = response.data
          accountState.timestampOfState = new Date(accountState.timestampOfState)
          return this.setAccountStateFromSave(accountState)
        })
      
    },
    fetchBothStates() {
      this.requestNewState()
      this.loadState()
        .then((result) => {
          console.log(result)
          // alert('yay')
        })
        .catch((err) => {
          console.error(err)
          // alert('whoops')
        })
    },
    requestNewState() {
      this.fetchAccountStateFromGW2Api(this.selectedApiKey.apikey)
    },
  },
  computed: {
    ...mapGetters([
      'accountStateFromApi',
      'accountStateFromSave',
      'itemLookup',
      'currencyLookup',
      'materialStorageDetails',
      'user',
      'apikeys',
      'selectedApiKey',
    ])
  },
  created() {
    this.loadCurrencyLookupFromApi()
    this.loadMaterialStorageDetailsFromApi()
  }

}
</script>

<style scoped>
#stateViewers {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
