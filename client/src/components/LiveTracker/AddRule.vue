<template>
  <v-card class="AddRule">
    <v-container>
      <v-row>
        <v-col>
          <v-select v-model="type" :items="typeOptions"></v-select>
        </v-col>
        <v-col>
          <v-select
            :disabled="!type"
            v-model="matchType"
            :items="matchTypeOptions"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field label="Min Qty" v-model="min"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field label="Max Qty" v-model="max"></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="matchType === 'Id'">
        <v-col>
          <key-element-selector
            v-model="selectedElement"
            label="Select Element for Rule"
            :elements="elementSelectOptions"
            :search="elementSearch"
            filled
          />
        </v-col>
      </v-row>

      <v-row v-if="type === 'item' && matchType === 'Item Properties'">
        <v-col>
          <v-select
            label="Item Rarity"
            v-model="itemRarity"
            :items="itemRarityOptions"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            label="Item Type"
            v-model="itemType"
            :items="itemTypeOptions"
          ></v-select>
        </v-col>
        <v-col v-if="itemType && itemType.match(/Weapon|Armor|Trinket/g)">
          <v-select
            label="Item Sub-type"
            v-model="itemSubType"
            :items="itemSubTypeOptions"
          ></v-select>
        </v-col>
        <v-col v-if="itemType === 'Armor'">
          <v-select
            label="Armor Weight"
            v-model="itemArmorWeight"
            :items="itemArmorWeightOptions"
          ></v-select>
        </v-col>
      </v-row>

      <!-- <v-row justify="end">
        <v-col cols="3">
        </v-col>
      </v-row> -->
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="saveRule">Add Rule</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import KeyElementSelector from "../selects/KeyElementSelector.vue";
import Rule from "../../js/liveFeed/Rule";
export default {
  name: "AddRule",
  components: { KeyElementSelector },
  data() {
    return {
      editing: true,
      type: null,
      matchType: null,
      min: null,
      max: null,
      itemRarity: null,
      itemType: null,
      itemSubType: null,
      itemArmorWeight: null,
      selectedElement: null,
      elementSearch: "",
      typeOptions: [
        { text: "Item", value: "item" },
        { text: "Currency", value: "currency" },
      ],
      itemRarityOptions: [
        "Junk",
        "Basic",
        "Fine",
        "Masterwork",
        "Rare",
        "Exotic",
        "Ascended",
        "Legendary",
      ],
      itemTypeOptions: [
        "Armor",
        "Back",
        "Bag",
        "Consumable",
        "Container",
        "CraftingMaterial",
        "Gathering",
        "Gizmo",
        "Key",
        "MiniPet",
        "Tool",
        "Trait",
        "Trinket",
        "Trophy",
        "UpgradeComponent",
        "Weapon",
      ],
      itemArmorWeightOptions: ["Light", "Medium", "Heavy"],
    };
  },
  props: {
    itemsSoFar: Object,
    currenciesSoFar: Object,
  },
  computed: {
    ...mapGetters(["itemLookup", "currencyLookup"]),
    matchTypeOptions() {
      const result = ["Any", "Id"];
      if (this.type === "item") {
        result.push("Item Properties");
      }
      return result;
    },
    itemSubTypeOptions() {
      switch (this.itemType) {
        case "Armor":
          return [
            "Boots",
            "Coat",
            "Gloves",
            "Helm",
            "HelmAquatic",
            "Leggings",
            "Shoulders",
          ];
        case "Weapon":
          return [
            "Axe",
            "Dagger",
            "Mace",
            "Pistol",
            "Scepter",
            "Sword",
            "Focus",
            "Shield",
            "Torch",
            "Warhorn",
            "Greatsword",
            "Hammer",
            "LongBow",
            "Rifle",
            "ShortBow",
            "Staff",
            "Harpoon",
            "Speargun",
            "Trident",
          ];
        case "Trinket":
          return ["Accessory", "Amulet", "Ring"];
        default:
          return null;
      }
    },

    match() {
      const result = {};
      if (this.matchType === "Id") {
        result.id = this.selectedElement.id;
      } else if (this.matchType === "Item Properties") {
        if (this.itemRarity) result.rarity = this.itemRarity;
        if (this.itemType) result.type = this.itemType;

        if (this.itemSubType || this.itemArmorWeight) {
          result.details = {};
          if (this.itemSubType) {
            result.details.type = this.itemSubType;
          }
          if (this.itemArmorWeight) {
            result.details.weight_class = this.itemArmorWeight;
          }
        }
      }
      return result;
    },
    itemsSoFarWithDetails() {
      const result = [];
      for (const id of Object.keys(this.itemsSoFar)) {
        const newDetails = { ...this.itemLookup[+id] };
        newDetails.quantity = this.itemsSoFar[id];
        newDetails.element_id = +id;
        result.push(newDetails);
      }
      return result;
    },
    currenciesSoFarWithDetails() {
      const result = [];
      for (const id of Object.keys(this.currenciesSoFar)) {
        const newDetails = { ...this.currencyLookup[+id] };
        newDetails.quantity = this.currenciesSoFar[id];
        newDetails.element_id = +id;
        result.push(newDetails);
      }
      return result;
    },
    elementSelectOptions: {
      get() {
        if (this.type === "item") {
          return this.itemsSoFarWithDetails;
        } else if (this.type === "currency") {
          return this.currenciesSoFarWithDetails;
        } else {
          return [];
        }
      },
      default: [],
    },
  },

  methods: {
    ...mapActions(["addRule"]),
    saveRule() {
      if (
        !(
          this.type &&
          (this.matchType === "Any" ||
            (this.matchType === "Id" && this.selectedElement) ||
            this.matchType === "Item Properties")
        )
      ) {
        console.log("bad rule");
        return;
      } else {
        //add rule
        const newRule = new Rule(this.type, this.match, this.min, this.max);
        this.addRule(newRule);
        this.clearSelections();
      }
    },
    clearSelections() {
      this.type = null;
      this.matchType = null;
      this.min = null;
      this.max = null;
      this.itemRarity = null;
      this.itemType = null;
      this.itemSubType = null;
      this.itemArmorWeight = null;
      this.selectedElement = null;
    },
  },
};
</script>

<style></style>
