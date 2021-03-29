<template>
  <v-card class="RegisterForm pa-10">
    <form>
      <v-text-field label="Username"
        v-model="username"
        />
      <v-text-field label="Email"
        v-model="email"
        />
      <v-text-field label="Password" type="password" 
        v-model="password"
        />
      <v-btn block
        @click="register"
        >
        Register
      </v-btn>
      <span class="registerError" v-if="registerErrorMessage !== ''">{{registerErrorMessage}}</span>
    </form>
  </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'RegisterForm',
  // components: {},
  data() {
    return {
      username: '',
      email: '',
      password: '',
      registerErrorMessage: '',
    }
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    register() {
      this.registerErrorMessage = ''
      this.email = this.email.trim()
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.email)) {
        this.registerErrorMessage = 'Invalid Email'
        return
      }
      const credentials = {
        username: this.username,
        email: this.email,
        password: this.password
      }
      this.$axios.post(`/api/auth/signup`, credentials)
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            this.setUser(response.data)
            window.alert(`Thanks for registering, ${response.data.username}!`)
          }
        })
        .catch((err) => {
          this.registerErrorMessage = err.response.data
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
.registerError {
  color:red
}
</style>