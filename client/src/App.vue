<template>

  <v-app id="app">
    
    <nav-bar-top />

    <v-main>
      <router-view/>
    </v-main>
  </v-app>



  <!-- <v-app id="app">
    <nav-bar-top v-if="user.username !== null"/>
    <h1 v-if="user.username === null">Login or Register</h1>
    <router-view/>
  </v-app> -->
</template>


<script>
import {mapActions, mapGetters} from 'vuex'
import NavBarTop from '@/components/navBarTop.vue'

export default {
  components: {
    NavBarTop
  },
  data() {
    return {
      drawer: null
    }
  },
  methods: {
    ...mapActions([
      'getUserFromSession',
      'getApiKeysFromUser'
    ]),
    
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  // created() {
  //   this.getUserFromSession()
  //     .then(() => {
  //       if (this.user.username) {
  //         //also get apikeys
  //         return this.getApiKeysFromUser()
  //       }
  //     })
  //     .catch((err) => {
  //       //if user isn't set here, redirect to /login
  //       console.error(err)
  //       this.$router.push('login')
  //     })
  // }

}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */


</style>
