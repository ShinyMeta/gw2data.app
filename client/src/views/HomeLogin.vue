<template>
  <div class="HomeLogin">
    <LoginForm />
    
    <RegisterForm />
    
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import LoginForm from '@/components/auth/LoginForm.vue'


export default {
  name: 'HomeLogin',
  components: {
    LoginForm,
    RegisterForm,
  },

}
</script>

<style>
.HomeLogin {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>