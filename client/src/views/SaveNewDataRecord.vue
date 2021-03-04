<template>
  <div class="SaveNewDataRecord">
    <form action="javascript:">
      Description:<input type="text" v-model="description" />
      <br />
      Details:<textarea  v-model="details" />
      <br />
      Primary Tag:<input type="text" v-model="primary_tag">
      <br />
      Key Element:<select  v-model="keyElement">
        <option v-for="(line, index) in newDataRecordLines"
          :key="`lineoption_${index}`" 
          :value="index"
          >{{line.element_type}}-{{getDetailForLineElement(line.element_type,line.element_id).name}}</option>
      </select>
      <br />
      <button @click="submitRecord">Submit Record</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SaveNewDataRecord',

  data: () => {
    return {
      description: '',
      details: '',
      primary_tag: '',
      keyElement: -1,
    }
  },
  methods: {
    ...mapActions('newDataRecord', [
      'updateNewDataRecord'
    ]),
    submitRecord() {
      this.updateNewDataRecord({
        description: this.description,
        details: this.details,
        primary_tag: this.primary_tag,
        primary_element_id: this.newDataRecordLines[this.keyElement].element_id,
        primary_element_type: this.newDataRecordLines[this.keyElement].element_type,
      })
      .then(() => {
        const newRecord = this.newDataRecord
        newRecord.lines = this.newDataRecordLines
        console.log('sending newRecord')
        console.log(newRecord)
        this.$axios.post(`/api/dataRecord/new`, newRecord)
          .then(({data}) => {
            this.$router.push(`DataRecordDetail/${data.id}`)
          })
          .catch((err) => {
            alert(err)
          })
      })

    },
    getDetailForLineElement(type, id) {
      if (type === 'Currency') {
        return this.currencyLookup[id]
      }
      if (type === 'Item') {
        return this.itemLookup[id]
      }
      return null
    }
  },
  computed: {
    ...mapGetters([
      'itemLookup',
      'currencyLookup',
    ]),
    
    ...mapGetters('newDataRecord', [
      'newDataRecord',
      'newDataRecordLines',
    ]),
  }

}
</script>

<style>

</style>