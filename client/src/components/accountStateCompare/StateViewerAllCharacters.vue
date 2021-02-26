<template>
  <div>
    <h1>Characters</h1>

    <input type="text" v-model="filterString" />
    <select v-model="sortOrder">
      <option value="Created Date">Created Date</option>
      <option value="Last Played">Last Played</option>
      <option value="Alpha">Alpha</option>
    </select>

    <StateViewerCharacter v-for="(character) in sortedAndFilteredCharacters"
      :key="character.name"
      :character="character"
      :itemLookup="itemLookup"
      />
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
      sortDirection: 'LowToHigh'
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
        case 'Alpha': return result.sort((a,b) => {
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