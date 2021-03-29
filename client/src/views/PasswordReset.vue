<template>
  <div class="PasswordReset">
    Enter your new password:
    <input type="password"
      v-model="newPassword"
      />
    <v-btn
      @click="submitPasswordChange"
      >
      Change Password
    </v-btn>
    <br />
    <span class="statusMessage" v-if="statusMessage !== ''">{{statusMessage}}</span>
  </div>
</template>

<script>
export default {
  name: 'PasswordReset',
  data() {
    return {
      newPassword: '',
      statusMessage: ''
    }
  },
  methods: {
    submitPasswordChange() {
      this.statusMessage = 'Sending...'
      return this.$axios.post('/api/auth/changePassword', {
        newPassword: this.newPassword,
        token: this.$route.params.token,
        userId: parseInt(this.$route.params.userId)
      })
        .then((res) => {
          console.log(res)
          this.statusMessage = 'pass change sent'
          this.$router.push('/login')
        })
        .catch((err) => {
          console.log(err.response.data.message)
          this.statusMessage = err.response.data.message
        })
    }
  }


}
</script>

<style>

</style>