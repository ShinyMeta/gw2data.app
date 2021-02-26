<template>
<!-- list of api keys -->
<div class="ApiKeyManager">
  <api-key-row v-for="(apikey, index) in apikeys"
    :key="`apikey_${index}`" 
    :apikey="apikey"
    />
    <!-- D2B5389F-F40A-4547-9D2C-FAC66DACEB63374FC165-8917-4A24-9DB0-74602CBF4253 -->
    <!-- CFBA11E8-CDAD-144E-82DF-1F3E8E1D7D855C321BCE-88F2-46D5-A27F-0DA6FC88F39A -->
  <input type="text" v-model="newApiKey">
  <button @click="submitAddKey">Add Key</button>
  <div class="newApiKeyError" v-if="newApiKeyErrorMessage !== ''">{{newApiKeyErrorMessage}}</div>
</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ApiKeyRow from './ApiKeyRow.vue'

export default {
  components: { ApiKeyRow },
  name: 'ApiKeyManager',
  data() {
    return {
      newApiKey: '',
      newApiKeyErrorMessage: '',
    }
  },
  methods: {
    ...mapActions([
      'addApiKey',
      // 'deleteApiKey'
    ]),
    submitAddKey() {
      this.newApiKeyErrorMessage = ''

      this.$axios.post('/api/account/apikey', {apikey: this.newApiKey})
        .then((response) => {
          // console.log(response)
          this.addApiKey(response.data)
        })
        .catch((err) => {
          //set error message 
          this.newApiKeyErrorMessage = err.response.data
        })
    }
  },
  computed: {
    ...mapGetters([
      'apikeys'
    ])
  }

}
</script>

<style>

.newApiKeyError {
  color:red
}
</style>