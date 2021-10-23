<template>
  <v-card class="RuleDisplay">
    <v-container>
      <v-row>
        <v-col>
          {{ ruleTypeString }}
        </v-col>
        <v-col>
          {{ matchType }}
        </v-col>
        <v-col>
          {{ rule.min }}
        </v-col>
        <v-col>
          {{ rule.max }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-btn @click="deleteThisRule">Delete</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="matchType === 'Id' && rule.type === 'item'">
        <v-col cols="1">
          <item-smart :id="+rule.match.id" />
        </v-col>
        <v-col>
          {{ itemLookup[+rule.match.id].name }}
        </v-col>
      </v-row>
      <v-row v-if="matchType === 'Id' && rule.type === 'currency'">
        <v-col cols="1">
          <item
            :id="+rule.match.id"
            :imageUrl="currencyLookup[+rule.match.id].icon"
          />
        </v-col>
        <v-col v-if="rule.type === 'currency'">
          {{ currencyLookup[+rule.match.id].name }}
        </v-col>
      </v-row>

      <v-row v-if="rule.type === 'item' && matchType === 'Item Properties'">
        <v-col v-if="rule.match.rarity">
          Item Rarity: {{ rule.match.rarity }}
        </v-col>
        <v-col v-if="rule.match.type"> Item Type: {{ rule.match.type }} </v-col>
        <v-col v-if="rule.match.details && rule.match.details.type">
          Item Sub-type: {{ rule.match.details.type }}
        </v-col>
        <v-col v-if="rule.match.details && rule.match.details.weight_class">
          Armor Weight: {{ rule.match.details.weight_class }}
        </v-col>
      </v-row>

      <!-- <v-row justify="end">
        <v-col cols="3">
        </v-col>
      </v-row> -->
    </v-container>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import KeyElementSelector from "../selects/KeyElementSelector.vue";
import Rule from "../../js/liveFeed/Rule";
import Item from "../Item.vue";
import ItemSmart from "../ItemSmart.vue";
export default {
  components: { ItemSmart, Item },
  name: "RuleDisplay",
  // components: { KeyElementSelector },
  data() {
    return {
      // editing: true,
      // type: null,
      // matchType: null,
      // min: null,
      // max: null,
      // itemRarity: null,
      // itemType: null,
      // itemSubType: null,
      // itemArmorWeight: null,
      // selectedElement: null,
      // elementSearch: "",
      // typeOptions: [
      //   { text: "Item", value: "item" },
      //   { text: "Currency", value: "currency" },
      // ],
      // itemArmorWeightOptions: ["Light", "Medium", "Heavy"],
    };
  },
  props: {
    rule: Rule,
  },
  computed: {
    ...mapGetters(["itemLookup", "currencyLookup"]),
    matchType() {
      if (this.rule.match.id) {
        return "Id";
      } else if (Object.keys(this.rule.match).length === 0) {
        return "Any";
      } else {
        return "Item Properties";
      }
    },
    ruleTypeString() {
      const result = {
        item: "Item",
        currency: "Currency",
      };
      return result[this.rule.type];
    },
  },

  methods: {
    ...mapActions(["deleteRule"]),
    deleteThisRule() {
      return this.deleteRule(this.rule);
    },
  },
};
</script>

<style></style>
