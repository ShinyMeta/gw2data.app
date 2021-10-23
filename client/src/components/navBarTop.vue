<template>
  <div class="NavBarTop">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-btn block to="/accountStateCompare">Account State Compare</v-btn>
      <v-btn block to="/myDataRecords">My Data Records</v-btn>
      <v-btn block to="/myTags">My Tags</v-btn>
      <v-btn block to="/myReports">My Reports</v-btn>
      <v-btn block to="/liveTracking">Live Tracking</v-btn>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>GW2Data.app</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-toolbar-title class="mx-4">Welcome, {{user.username}}</v-toolbar-title>
      <account-controls v-if="user.username !== null"/>
    </v-app-bar>
    <!-- <router-link to="/">AccountStateCompare</router-link> |
    <router-link to="/login" v-if="user.username === null">Login</router-link> | 
    <account-controls v-if="user.username !== null"/>
    <router-link to="/myDataRecords">My Data Records</router-link> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AccountControls from '@/components/auth/AccountControls.vue'

export default {
  name: 'NavBarTop',
  components: { 
    AccountControls,
  },
  data() {
    return {
      drawer: false
    }
  },


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