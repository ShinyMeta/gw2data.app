<template>
<div class="ApiKeyManager">

  <new-api-key-button />
 

  <v-data-table
    :headers="headers"
    :items="apikeys"
    :items-per-page="25"
    :footer-props="{
        itemsPerPageOptions:[10,25,50,-1]
      }"
  > 
    <template v-slot:[`item.actions`]="{ item }">
      <!-- <v-icon small class="mr-2" > 
        mdi-pencil </v-icon> -->
      <v-icon small @click="deleteKey(item)" > 
        mdi-delete </v-icon>
    </template>
  </v-data-table>
</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NewApiKeyButton from './NewApiKeyButton.vue'
// import ApiKeyRow from './ApiKeyRow.vue'

export default {
  components: { 
    NewApiKeyButton
    // ApiKeyRow 
  },
  name: 'ApiKeyManager',
  data() {
    return {
      // newApiKey: '',
      // newApiKeyNickname: '',
      // newApiKeyErrorMessage: '',
      headers: [
        { text: 'Nickname', value: 'nickname', groupable: false },
        { text: 'Account Name', value: 'account_name', groupable: false }, 
        { text: 'API Key', value: 'apikey', groupable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
    }
  },
  methods: {
    ...mapActions([
      // 'addApiKey',
      'deleteApiKey'
    ]),
    // submitAddKey() {
    //   this.newApiKeyErrorMessage = ''

    //   this.$axios.post('/api/account/apikey', { apikey: this.newApiKey, nickname: this.newApiKeyNickname })
    //     .then((response) => {
    //       // console.log(response)
    //       this.addApiKey(response.data)
    //     })
    //     .catch((err) => {
    //       //set error message 
    //       this.newApiKeyErrorMessage = err.response.data
    //     })
    // },
    deleteKey(apikey) {
      this.$axios.delete('/api/account/apikey', {data: {apikey: apikey.apikey}})
        .then((response) => {
          console.log(response)
          this.deleteApiKey(apikey.apikey)
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
  computed: {
    ...mapGetters([
      'apikeys'
    ])
  }

}
</script>

<style>

</style>