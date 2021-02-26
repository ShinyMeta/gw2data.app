const mongoose = require('mongoose')


module.exports = mongoose.model('AccountState', new mongoose.Schema({
  apikey: String,
  user_id: Number,
  id: {type:String, unique:true},
  wallet:[Object],
  bank:[Object],
  materialStorage: Object,
  sharedInventory:[Object],
  characters:[Object],
  timestampOfState: Date
},
{
  timestamps: true
}))

// module.exports = mongoose.model('item_detail', new mongoose.Schema({
//   id: {type:Number, unique:true},
//   chat_link: String, //- The chat link.
//   name: String, //- The item name.
//   icon: String, //- The full icon URL.
//   description: String,//- The item description.
//   type: String, //- The item type see below,. Possible values:
//   rarity: String, //- The item rarity. Possible values:
//   level: Number, //- The required level.
//   vendor_value: Number, //- The value in coins when selling to a vendor. Can be non-zero even when the item has the NoSell flag.,
//   default_skin: Number, //- The default skin id.
//   flags: {
//     type: [String],
//     default: undefined
//   }, //- Flags applying to the item. Possible values:
//   game_types:  {
//     type: [String],
//     default: undefined
//   }, //- The game types in which the item is usable. At least one game type is specified. Possible values:
//   restrictions:  {
//     type: [String],
//     default: undefined
//   }, //- Restrictions applied to the item. Possible values:
//   upgrades_into: {
//     type: [],
//     default: undefined
//   }, //- Lists what items this item can be upgraded into, and the method of upgrading. Each object in the array has the following attributes:
//   upgrades_from: {
//     type: [],
//     default: undefined
//   }, //- Lists what items this item can be upgraded from, and the method of upgrading. See upgrades_into for format.
//   details: Object, //- Additional item details if applicable, depending on the item type (see below).
// }))


