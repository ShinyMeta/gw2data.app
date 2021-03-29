<template>
  <div>
    <!-- <input type="text" v-model="filterString" /> -->

    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="filterString"
            label="Filter Characters"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select 
            v-model="sortOrder"
            :items="charSortTypes"
            item-text="text"
            item-value="value"

            label="Character Sort Order"      
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels>
            <StateViewerCharacter 
              v-for="(character) in sortedAndFilteredCharacters"
              :key="character.name"
              :character="character"
              :itemLookup="itemLookup"
              />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>




  </div>
</template>

<script>
import StateViewerCharacter from './StateViewerCharacter'

export default {
name: "StateViewerAllCharacters",
  components:{
    StateViewerCharacter
  },
  props: {
    characters: Array,
    itemLookup: Object
  },
  data() {
    return {
      filterString: '',
      sortOrder:'Created Date',
      sortDirection: 'LowToHigh',
      charSortTypes: [
        { text: 'Created Date', value: 'Created Date'},
        { text: 'Last Played', value: 'Last Played'},
        { text: 'Alphabetical', value: 'Alphabetical'},
      ]
    }
  },
  computed:{
    sortedAndFilteredCharacters() {
      //filter then sort
      
      return this.sort(this.sortOrder, this.sortDirection, this.filter(this.filterString, this.characters))
    },

  },
  methods: {
    sort(sortOrder, sortDirection, characters) {
      let result = characters.slice()
      if (sortDirection === 'HighToLow') {
        result.reverse()
      }
      switch(sortOrder) {
        case 'Last Played': return result
        case 'Alphabetical': return result.sort((a,b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
        case 'Created Date': return result.sort((a, b) => Date.parse(a.created) - Date.parse(b.created))
      }
      return
    },
    filter(filterString, characters) {
      const filter = new RegExp(filterString, "ig")
      return characters.slice().filter((x) => x.name.match(filter))
    }
  }

}
</script>

<style>

</style>