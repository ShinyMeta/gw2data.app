<template>
  <div class="ApiKeyRow">
    <!-- account name -->
    <div class="accountName">{{apikey.account_name}}</div>
    <!-- api key -->
    <div class="nickname">{{apikey.nickname}}</div>
    <div class="apikey">{{apikey.apikey}}</div>
    <!-- delete v-btn -->
    <v-btn @click="deleteKey">Delete</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ApiKeyRow',
  props: {
    apikey: Object
  },
  methods: {
    ...mapActions([
      'deleteApiKey'
    ]),
    deleteKey() {
      this.$axios.delete('/api/account/apikey', {data: {apikey: this.apikey.apikey}})
        .then((response) => {
          console.log(response)
          this.deleteApiKey(this.apikey.apikey)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>

<style>
.ApiKeyRow {
  border: black 1px solid
}
</style>