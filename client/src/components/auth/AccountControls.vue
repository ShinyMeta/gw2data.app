<template>
<div class="AccountControls">
  
  <!-- <span>Hi, {{user.username}}</span> -->
  <v-btn @click="logout">
    <v-icon left>mdi-logout</v-icon>
    Logout
  </v-btn>
  <v-btn to="/accountSettings">
    <v-icon left>mdi-account-cog</v-icon>
    Account Settings
  </v-btn> 
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'AccountControls',
  
  methods: {
    ...mapActions([
      'userWasLoggedOut'
    ]),
    logout() {
      this.$axios.post(`/api/auth/logout`)
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            window.alert(`Come back soon, ${this.user.username}!`)
            this.userWasLoggedOut()
            this.$router.push('login')
          }
        })
    },
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }

}
</script>

<style>

</style>