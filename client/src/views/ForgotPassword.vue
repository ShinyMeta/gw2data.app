<template>
  <div class="ForgotPassword">
    Submit your Username to request an email containing a password reset link:
    <input type="text"
      v-model="username"
      />
    <button type="button"
      @click="requestResetEmail"
      >
      Request Password Reset Email
    </button>
    <br />
    <span class="statusMessage" v-if="statusMessage !== ''">{{statusMessage}}</span>

  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      username: '',
      statusMessage: ''
    }
  },
  methods: {
    requestResetEmail() {
      this.statusMessage = 'Sending...'
      return this.$axios.post('/api/auth/forgotPassword', {username: this.username})
        .then((res) => {
          console.log(res)
          this.statusMessage = 'Password reset requested.  Please check your email for a link to reset your password.'
        })
    }
  }

}
</script>

<style>

</style>