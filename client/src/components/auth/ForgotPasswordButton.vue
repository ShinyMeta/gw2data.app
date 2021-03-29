<template>
  <!-- <div class="ForgotPassword">
    Submit your Username to request an email containing a password reset link:
    <input type="text"
      v-model="username"
      />
    <v-btn 
      @click="requestResetEmail"
      >
      Request Password Reset Email
    </v-btn>
    <br />
    <span class="statusMessage" v-if="statusMessage !== ''">{{statusMessage}}</span>

  </div> -->


  <v-dialog
    v-model="forgotPasswordDialog"
    max-width="700px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        block
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        Forgot Password? Click Here
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Forgot Password</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field label="Submit your Username to request an email containing a password reset link:"
                v-model="username"
                :hint="statusMessage"
                persistent-hint
                />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="forgotPasswordDialog=false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="requestResetEmail"
        >
          Request Reset Email
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ForgotPasswordButton',
  data() {
    return {
      username: '',
      statusMessage: '',
      forgotPasswordDialog: false
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