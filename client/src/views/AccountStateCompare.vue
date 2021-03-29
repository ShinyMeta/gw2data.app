<template>
  <div class="AccountStateCompare">
    
    <v-container>
      <v-row>
        <v-col>
          <api-key-select @change="clearAccountStates"/>
        </v-col>
        <v-col>
          <v-btn type="button" @click="fetchBothStates" v-if="selectedApiKey !== null"> Load/Refresh Account States </v-btn>
          <!-- <v-btn type="button" @click="saveState" v-if="accountStateFromApi.wallet.length > 0"> Copy Live State to Save </v-btn> -->
          <v-dialog
            v-if="accountStateFromApi.wallet.length > 0"
            v-model="confirmSaveStateDialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                v-bind="attrs"
                v-on="on"
              >
                Copy Live State to Save 
              </v-btn>
              <!-- <v-btn
                color="red lighten-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Click Me
              </v-btn> -->
            </template>

            <v-card>
              <v-card-title>
                Confirm
              </v-card-title>

              <v-card-text>
                This will over-write the currently saved state. OK?
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="saveState"
                >
                  Yes
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="confirmSaveStateDialog = false"
                >
                  No
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
    

    <v-tabs
      v-model="statesOrDiff"
      centered
    >
      <v-tab :href="'#tab-saved'" >
        Saved State
      </v-tab>
      <v-tab :href="'#tab-live'" >
        Live State
      </v-tab>
      <v-tab :href="'#tab-diff'" >
        Differences
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="statesOrDiff">
      <v-tab-item :value="'tab-saved'" >
        <StateViewer
          :accountState="accountStateFromSave"
          :currencyLookup="currencyLookup"
          :itemLookup="itemLookup"
          :materialStorageDetails="materialStorageDetails"
          />
      </v-tab-item>
      <v-tab-item :value="'tab-live'">
        <StateViewer
          :accountState="accountStateFromApi"
          :currencyLookup="currencyLookup"
          :itemLookup="itemLookup"
          :materialStorageDetails="materialStorageDetails"
          />
      </v-tab-item>
      <v-tab-item :value="'tab-diff'" >
        <AccountStateDiff
          v-if="accountStateFromApi.wallet.length > 0 && accountStateFromSave.wallet.length > 0" 
          />
      </v-tab-item>
    </v-tabs-items>


  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import StateViewer from '@/components/accountStateCompare/StateViewer.vue'
import AccountStateDiff from '@/components/accountStateCompare/AccountStateDiff.vue'
// const client = require('gw2api-client')
import {mapGetters, mapActions} from 'vuex'
import ApiKeySelect from '../components/accountStateCompare/ApiKeySelect.vue'

// Get an instance of an API client

export default {
  name: 'AccountStateCompare',
  components: {
    StateViewer,
    AccountStateDiff,
    ApiKeySelect,
    // AccountControls,
  },
  data() {
    return {
      confirmSaveStateDialog: false,
      selectedApiKeyOption: 'default',
      apikeyAuthenticated: false,
      statesOrDiff: 'tab-live'
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
      this.confirmSaveStateDialog = false

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
/* #stateViewers {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
} */
</style>
