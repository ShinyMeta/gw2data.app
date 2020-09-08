<template>
  <div class="home">
    <iframe hidden=true name="dummyFormSubmitTargetFrame"></iframe>
    <form @submit="submitApikey" target="dummyFormSubmitTargetFrame">
      <label for="apikeyInput"> Enter API Key: </label>
      <input type="text" v-model="apikey"
        pattern="[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{20}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}"
        id="apikeyInput"
        />
      <button type="submit"> Request Account State </button>
    </form>

    <StateViewerFromApi 
      :api="api"
      :apikeyAuthenticated="apikeyAuthenticated"
      />
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import StateViewerFromApi from '@/components/StateViewerFromApi.vue'
const client = require('gw2api-client')

// Get an instance of an API client

export default {
  name: 'Home',
  components: {
    StateViewerFromApi
  },
  data() {
    return {
      api: client(),
      apikey: 'CFBA11E8-CDAD-144E-82DF-1F3E8E1D7D855C321BCE-88F2-46D5-A27F-0DA6FC88F39A',
      apikeyAuthenticated: false,
      accountState: {
        wallet:[],
        bank:[],
        materialStorage:[],
        sharedInventory:[],
        characters:[],
      },
      currencyLookup:{},
      itemLookup:{},
    }
  },
  methods:{
    submitApikey() {
      this.api.authenticate(this.apikey)
      this.api.account().get()
        .then(() => {
          this.apikeyAuthenticated = true
        })
        .catch((err) => {
          alert('API Key did not Authenticate successfully.  Please try again.')
          console.error(err)
          this.apikeyAuthenticated = false
        })
    },
  },


}
</script>
