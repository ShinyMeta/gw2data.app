<template>
<div class="AccountControls">
  <span>Hi, {{user.username}}</span>
  <button @click="logout">Logout</button>
  <router-link to="/accountSettings">Account Settings</router-link> 
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