<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <StateViewer/>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import StateViewer from '@/components/StateViewer.vue'

export default {
  name: 'Home',
  components: {
    StateViewer
  }
}
</script>
