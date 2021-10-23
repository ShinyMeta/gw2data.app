<template>
  <div class="Item">
    <img
      class="itemIcon"
      :src="imageUrl"
      :alt="name"
      :class="quantity === 0 ? 'zeroQtyItem' : ''"
    />
    <!-- <div id="quantityContainer" v-if="quantity"> -->
    <div class="itemQuantity" v-if="quantity">
      {{ quantity }}
    </div>
    <div
      class="rarityBorder"
      :class="quantity < 0 ? ' negativeQtyItem' : rarity"
      v-if="rarity"
    ></div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "Item",
  components: {},
  props: {
    imageUrl: {
      type: String,
      default: "/images/empty_item_slot.png",
    },
    name: String,
    id: Number,
    description: String,
    rarity: String,
    quantity: {
      type: Number,
      default: null,
    },
    showPosNeg: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    tooltipText() {
      return ``;
    },
  },
};
</script>

<style scoped>
.Item {
  height: 64px;
  width: 64px;
  position: relative;
}

.itemIcon {
  height: 64px;
}

.zeroQtyItem {
  /* filter: blur(5px); */
  /* filter: brightness(0.4); */
  /* filter: contrast(200%); */
  /* filter: drop-shadow(16px 16px 20px yellow); */
  /* filter: grayscale(100%); */
  /* filter: hue-rotate(90deg); */
  /* filter: invert(75%); */
  /* filter: opacity(75%); */
  filter: opacity(75%) grayscale(100%);
  /* filter: saturate(20%); */
  /* filter: sepia(100%); */
}

.negativeQtyItem {
  background-image: radial-gradient(
    circle at center,
    red 0,
    rgba(0, 0, 0, 0) 150%
  );
  opacity: 0.8;
  box-shadow: inset 0 0 0 2px red;
}

.itemQuantity {
  height: 64px;
  width: 60px;
  top: 0px;
  position: absolute;
  text-align: right;
  color: white;
  text-shadow: -1px 0px 2px black, 1px 0px 2px black, 0px -1px 2px black,
    0px 1px 2px black;
}

.rarityBorder {
  position: absolute;
  height: 64px;
  width: 64px;
  top: 0;
}

.Junk {
  border: 2px solid#aaa;
}
.Basic {
  border: 2px solid#fff;
}
.Fine {
  border: 2px solid#648ec8;
}
.Masterwork {
  border: 2px solid#42a435;
}
.Rare {
  border: 2px solid#fcd00b;
}
.Exotic {
  border: 2px solid#ffa405;
}
.Ascended {
  border: 2px solid#cc477e;
}
.Legendary {
  border: 2px solid#9152fd;
}
</style>
