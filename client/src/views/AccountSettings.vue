<template>
  <div class="AccountSettings">
  
    
     

    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              {{user.username}}'s Settings
            </v-card-title>

    <v-container>
      <v-row>
        <v-col cols=4>
            <v-btn block>Change Email</v-btn>
        </v-col>
        <v-col>
            <span>{{user.email}} </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols=4>
            <v-btn block>Reset Password</v-btn>
        </v-col>
        <v-col>
            <span>(requires email verification)</span>
        </v-col>
      </v-row>
    </v-container>

          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- apikeys--> 
          <api-key-manager />
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiKeyManager from '@/components/accountSettings/ApiKeyManager.vue'

export default {
  components: { ApiKeyManager },
  name: 'AccountSettings',

  computed: {
    ...mapGetters([
      'user'
    ])
  }

}
</script>

<style>

</style>