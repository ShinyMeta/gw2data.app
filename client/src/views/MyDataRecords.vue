<template>
  <div class="DataRecordList">
    data record list
    <div v-for="(dataRecord) in dataRecords"
      :key="dataRecord.id"
      >
      <router-link :to="`/DataRecordDetail/${dataRecord.id}`">
        {{dataRecord.id}} - {{dataRecord.description}}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DataRecordList',
  methods: {
    ...mapActions([
      'fetchDataRecords'
    ])
  },
  computed:{
    ...mapGetters([
      'dataRecords'
    ])
  },
  created() {
    this.fetchDataRecords()
  }
}
</script>

<style>

</style>