export default class Rule {
  constructor(type, match, min, max) {
    this.type = type; //item or currency
    this.match = match;
    this.min = min;
    this.max = max;
  }

  dropMatches(drop, itemLookup) {
    //check for element that matches
    if (this.type === "currency") {
      for (const id of Object.keys(drop.curr)) {
        if (this.currencyMatches({ id, quantity: drop.curr[id] })) {
          return true;
        }
      }
    }
    if (this.type === "item") {
      for (const id of Object.keys(drop.items)) {
        if (
          this.itemMatches({ id, quantity: drop.items[id], ...itemLookup[id] })
        ) {
          return true;
        }
      }
    }

    return false;
  }

  currencyMatches(currencyFromDrop) {
    if (this.match.id && this.match.id != currencyFromDrop.id) {
      return false;
    }
    return this.quantityMatches(currencyFromDrop.quantity);
  }

  itemMatches(itemFromDrop) {
    for (const condition of Object.keys(this.match)) {
      if (
        this.match[condition] !== itemFromDrop[condition] &&
        condition != "details"
      ) {
        return false;
      }
    }
    if (this.match.details) {
      for (const condition of Object.keys(this.match.details)) {
        if (this.match.details[condition] !== itemFromDrop.details[condition]) {
          return false;
        }
      }
    }
    return this.quantityMatches(itemFromDrop.quantity);
  }

  quantityMatches(quantity) {
    let result = true;
    if (this.min) {
      result = result && this.min <= quantity;
    }
    if (this.max) {
      result = result && this.max >= quantity;
    }
    return result;
  }
}
