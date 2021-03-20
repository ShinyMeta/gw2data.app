<template>
  <div class="RegisterForm">
    <form>
      <label>Username:
      <input type="text" 
        v-model="username"
        />
      </label>
      <br>
      <label>Email:
      <input type="text" 
        v-model="email"
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
        @click="register"
        >
        Register
      </button>
      <span class="registerError" v-if="registerErrorMessage !== ''">{{registerErrorMessage}}</span>
    </form>
  </div>
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