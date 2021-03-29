<template>
  <div class="HomeLogin">

    <v-container>
      <v-row>
        <v-col>
          <h1>Login or Register</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <LoginForm />
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <RegisterForm />
        </v-col>
      </v-row>
    </v-container>

    
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { mapGetters } from 'vuex'


export default {
  name: 'HomeLogin',
  components: {
    LoginForm,
    RegisterForm,
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },

}
</script>

<style scoped>
h1 {
  text-align: center
}
/* .HomeLogin {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
} */
</style>