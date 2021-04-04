<template>
  <v-chip-group 
    v-if="tagNames.length > 0 && tagNames[0] !== null"
    column
  >
    <v-chip
      v-for="(tag) in tagsWithPrimaryFirst"
      :key="tag"
      :ripple="false"
      :outlined="tag!==primaryTagName"
    >{{tag}}</v-chip>
  </v-chip-group>
</template>

<script>
export default {
  name:'TagsListCell',
  props: {
    primaryTagName: String,
    tagNames: Array,
  }, 
  data() {
    return {

    }
  },
  computed:{
    tagsWithPrimaryFirst() {
      const newOrder = [...this.tagNames]
      newOrder.sort((a,b )=> {
        if (a === this.primaryTagName) return -1
        else if (b === this.primaryTagName) return 1
        else return 0
      })
      return newOrder
    }

  }


}
</script>

<style>

</style>