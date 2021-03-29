<template>
  <v-select class="ApiKeySelect"
    :value="selectedApiKey" 
    @change="selectOnChange"
    :items="apikeys"
    :item-text="textDisplay"
    item-value="apikey"

    label="Select an API Key to use"
    :hint="selectedApiKey?`${selectedApiKey.account_name} - ${selectedApiKey.apikey}`:``"
    persistent-hint
    return-object
    
  > </v-select>
    <!-- :disabled="selectedApiKey !== null" -->
  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ApiKeySelect',
  data() {
    return {
      // selectedApiKeyOption: '',
    } 
  },
  computed:{
    ...mapGetters([
      'apikeys',
      'selectedApiKey',
    ])
  },
  methods:{
    ...mapActions([
      'selectApiKey',
      'deselectApiKey',
    ]),
    selectOnChange(apikey) {
      this.$emit('change', apikey)
      this.selectApiKey(apikey)
    },
    textDisplay(apikey) {
      let abbrevKey = `${apikey.apikey.substr(0,4)}...${apikey.apikey.substr(68,4)}`
      return `${apikey.nickname} (${abbrevKey})`
    }
  }

}
</script>

<style>

</style>