<template>
  <div class="NavBarTop">
    <router-link to="/">AccountStateCompare</router-link> |
    <router-link to="/login" v-if="user.username === null">Login</router-link> | 
    <account-controls v-if="user.username !== null"/>
    <router-link to="/myDataRecords">My Data Records</router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AccountControls from '@/components/auth/AccountControls.vue'

export default {
  components: { 
    AccountControls,
  },
  name: 'NavBarTop',


  computed: {
    ...mapGetters([
      'user'
    ])
  },
}
</script>

<style>

.NavBarTop {
  padding: 30px;
}

.NavBarTop a {
  font-weight: bold;
  color: #2c3e50;
}

.NavBarTop a.router-link-exact-active {
  color: #42b983;
}
</style>