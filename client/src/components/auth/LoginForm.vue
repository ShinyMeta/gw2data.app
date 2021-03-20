<template>
  <div class="LoginForm">
    <form>
      <label>Username:
      <input type="text" 
        v-model="username"
        />
      </label>
      <br>
      <label>Password:
      <input type="password" 
        v-model="password"
        />
      </label>
      <br>
      <button type="button"
        @click="login"
        >
        Login
      </button>
      <span class="loginError" v-if="loginErrorMessage !== ''">{{loginErrorMessage}}</span>
    </form>

    <div>
      Forgot Password? <router-link to="/forgotPassword">Click here.</router-link>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
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