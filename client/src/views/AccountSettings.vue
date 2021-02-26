<template>
  <div class="AccountSettings">
    <!-- username -->
    <span>{{user.username}}'s Settings</span>
    <br/>

    <!-- change email -->
    <span>{{user.email}} </span>
    <button>Change Email</button>
    <br/>
    
    <!-- reset password  -->
    <button>Reset Password</button>
    
    <!-- apikeys--> 
    <api-key-manager />

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