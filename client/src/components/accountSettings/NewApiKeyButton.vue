<template>
  <v-dialog
    v-model="addNewKeyDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        New API Key
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New API Key</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field label="Api Key" 
                v-model="newApiKey"
                :error-messages="newApiKeyErrorMessage"
                />
            </v-col>
            <v-col>
              <v-text-field label="Nickname (optional)" 
                v-model="newApiKeyNickname"
                />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="addNewKeyDialog=false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="submitAddKey"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "NewApiKeyButton",
  props: {

  },
  data() {
    return {
      addNewKeyDialog: false,
      newApiKey: '',
      newApiKeyNickname: '',
      newApiKeyErrorMessage: '',
    }
  },
  methods: {
    ...mapActions([
      'addApiKey',
    ]),
    submitAddKey() {
      this.newApiKeyErrorMessage = ''

      this.$axios.post('/api/account/apikey', { apikey: this.newApiKey, nickname: this.newApiKeyNickname })
        .then((response) => {
          // console.log(response)
          this.addApiKey(response.data)
          this.addNewKeyDialog = false
        })
        .catch((err) => {
          //set error message 
          this.newApiKeyErrorMessage = err.response.data
        })
    },

  }

}
</script>

<style>

</style>