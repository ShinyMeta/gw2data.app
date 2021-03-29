<template>
  <v-card class="LoginForm pa-10" >

    <v-text-field label="Username"
      v-model="username"
      
      />
    <v-text-field label="Password" type="password" 
      v-model="password"
      />
    <v-btn block
      @click="login"
      >
      Login
    </v-btn>
    <span class="loginError" v-if="loginErrorMessage !== ''">{{loginErrorMessage}}</span>
    

    <v-card-text>
      <forgot-password-button />
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import ForgotPasswordButton from './ForgotPasswordButton.vue'

export default {
  components: { ForgotPasswordButton },
  name: 'LoginForm',
  // components: {},
  data() {
    return {
      username: '',
      password: '',
      loginErrorMessage: '',
    }
  },
  methods: {
    ...mapActions([
      'setUser',
      'getApiKeysFromUser',
    ]),
    login() {
      this.loginErrorMessage = ''
      const credentials = {
        username: this.username,
        password: this.password
      }
      this.$axios.post(`/api/auth/login`, credentials)
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            this.setUser(response.data)
          }
          // window.alert(`Welcome ${response.data.username}!`)
          this.$router.push('accountSettings')
          return this.getApiKeysFromUser()
        })
        .catch((err) => {
          this.loginErrorMessage = err.response.data
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
.loginError {
  color:red
}

</style>