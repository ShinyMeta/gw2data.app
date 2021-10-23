// import Rule from '../../js/liveFeed/Rule'

export default {
  state: {
    rules: [],
  },

  getters: {
    rules: (state) => state.rules,
  },

  actions: {
    addRule({ commit }, rule) {
      commit("addRule", rule);
    },
    deleteRule({ commit }, rule) {
      commit("deleteRule", rule);
    },
  },

  mutations: {
    addRule(state, rule) {
      state.rules.push(rule);
    },
    deleteRule(state, rule) {
      const index = state.rules.findIndex((x) => x === rule);
      if (index !== -1) {
        state.rules.splice(index, 1);
      }
    },
  },
};
