<template>
<div class="accountStateDiff">
  <button @click="saveRecord">Save Record</button>
  <div id="diffCurrencies">
    <Currency v-for="(currency) in currDiffs" 
      :key="currency.id" 
      :imageUrl="currencyLookup[currency.id].icon"
      :name="currencyLookup[currency.id].name"
      :id="currency.id"
      :description="currencyLookup[currency.id].description"
      :quantity="currency.diffCount"
      />
  </div>
  <div id="diffItems">
    <Item class="item" v-for="(diffItem, key, index) in itemDiffs"
      :key="`diffItem_${key}`"
      :imageUrl="diffItem&&itemLookup[diffItem.id]?itemLookup[diffItem.id].icon:undefined"
      :name="diffItem&&itemLookup[diffItem.id]?itemLookup[diffItem.id].name:undefined"
      :id="diffItem?diffItem.id:undefined"
      :description="diffItem&&itemLookup[diffItem.id]?sourceDetailString(diffItem.beforeSources,diffItem.afterSources):undefined"
      :quantity="diffItem?diffItem.diffCount:undefined"
      :grid-area="`${Math.floor(index/10)+1}/${index%10+1}/span 1/span 1`"
      />
  </div>
</div>
</template>

<script>
import Currency from '@/components/Currency'
import Item from "@/components/Item"
import {mapGetters, mapActions} from 'vuex'

export default {
  name: "AccountStateDiff",
  components:{
    Item,
    Currency
  },
  props: {  
  },
  data: () => {
    return {
      diffCurrencies: []
    }
  },
  methods: {
    ...mapActions('newDataRecord', [
      'updateNewDataRecord',
      'setNewDataRecordLines',
    ]),
    saveRecord() {
      const newDataRecord = {
        user_id: this.user.id,
        gw2_account_name: this.selectedApiKey.account_name,
        start_time: this.accountStateFromSave.timestampOfState,
        end_time: this.accountStateFromApi.timestampOfState,
      }
      this.updateNewDataRecord(newDataRecord)

      //now also get the lines into 
      let lines = []
      this.currDiffs.forEach((currDiff) => {
        const newLine = {
          quantity: currDiff.diffCount,
          element_id: currDiff.id,
          element_type: 'Currency',
        }
        lines.push(newLine)
      })

      Object.keys(this.itemDiffs).forEach((item_id) => {
        const newLine = {
          quantity: this.itemDiffs[item_id].diffCount,
          element_id: this.itemDiffs[item_id].id,
          element_type: 'Item',
          upgrades: this.itemDiffs[item_id].upgrades.join(',')
        }
        lines.push(newLine)
      })
      this.setNewDataRecordLines(lines)

      this.$router.push('saveNewDataRecord')
    },

    calculateCurrencyTotalDiffs(beforeWallet, afterWallet) {
      let currencyTotalDiffs = {}
      Object.keys(this.currencyLookup).forEach((currId) => {
        currencyTotalDiffs[currId] = {}
      })

      beforeWallet.forEach(x => {
        currencyTotalDiffs[x.id].beforeCount = x.value
      })
      afterWallet.forEach(x => {
        currencyTotalDiffs[x.id].afterCount = x.value
      })

      let result = []
      Object.keys(this.currencyLookup).forEach((currId) => {
        let bef = 0, aft = 0
        if (currencyTotalDiffs[currId].beforeCount) {bef = currencyTotalDiffs[currId].beforeCount}
        if (currencyTotalDiffs[currId].afterCount) {aft = currencyTotalDiffs[currId].afterCount}
        if (bef !== aft) {
          result.push({
            id: parseInt(currId),
            diffCount: aft-bef,
          })
        }
      })

      result.sort((a,b) => {
        return this.currencyLookup[a.id].order - this.currencyLookup[b.id].order
      })
      return result
    },
    calculateItemTotalDiffs(beforeTotals, afterTotals) {
      if (!beforeTotals || !afterTotals) { return null }


      let itemIdSet = new Set()
      let itemTotalDiffs = {}
      Object.keys(beforeTotals).forEach(x => {
        itemIdSet.add(x)
      })
      Object.keys(afterTotals).forEach(x => {
        itemIdSet.add(x)
      })
      Array.from(itemIdSet).forEach((itemId) => {
        let beforeCount = 0, afterCount = 0
        if (beforeTotals[itemId]) { beforeCount = beforeTotals[itemId].count }
        if (afterTotals[itemId]) { afterCount = afterTotals[itemId].count }
        let diffCount = afterCount - beforeCount
        if (diffCount !== 0) {
          let [id, ...upgrades] = itemId.split('_')
          itemTotalDiffs[itemId] = {
            id: parseInt(id),
            diffCount,
            upgrades: upgrades,
            beforeSources: beforeTotals[itemId]?beforeTotals[itemId].sources:[],
            afterSources: afterTotals[itemId]?afterTotals[itemId].sources:[]
          }
        }
      })
      return itemTotalDiffs
    },

    sourceDetailString(beforeSources, afterSources) {
      return `    Before:\n${beforeSources.join('\n')}\n    After:\n${afterSources.join('\n')}`
    }
  },
  computed: {
    ...mapGetters([
      'accountStateFromApi',
      'accountStateFromSave',
      'itemTotalsFromApi',
      'itemTotalsFromSave',
      'currencyLookup',
      'itemLookup',
      'user',
      'selectedApiKey',
    ]),
    itemDiffs() {
      return this.calculateItemTotalDiffs(this.itemTotalsFromSave, this.itemTotalsFromApi)
    },
    currDiffs() {
      return this.calculateCurrencyTotalDiffs(this.accountStateFromSave.wallet, this.accountStateFromApi.wallet)
    }
  }

}
</script>

<style>
  #diffItems{
    display: grid;
    justify-content: center;
    grid-template: repeat(auto-fill, 64px) / repeat(10 , 64px);
  }
</style>