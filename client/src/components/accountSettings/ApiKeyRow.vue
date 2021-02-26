<template>
  <div class="ApiKeyRow">
    <!-- account name -->
    <div class="apikeyname">{{apikey.account_name}}</div>
    <!-- api key -->
    <div class="apikey">{{apikey.apikey}}</div>
    <!-- delete button -->
    <button @click="deleteKey">Delete</button>
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
          // window.alert('apikey deleted')
        })
        .catch((err) => {
          console.error(err)
          // window.alert('uh-oh')
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