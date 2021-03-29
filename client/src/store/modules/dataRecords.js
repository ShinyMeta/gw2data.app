

import axios from 'axios'


export default {

  state: {
    dataRecords: [],
    dataRecordWithDetails: {
      lines: []
    }
  },

  getters: {
    dataRecords: state => state.dataRecords,
    dataRecordWithDetails: state => state.dataRecordWithDetails,
  },

  actions: {
    fetchDataRecords({commit}) {
      return axios.get(`/api/dataRecord/list`)
        .then((response) => {
          commit('setDataRecords', response.data)
        })
        .catch((err) => {
          console.error(err)
        }) 
    },
    fetchDataRecordWithDetails({commit}, record_id) {
      return axios.get(`/api/dataRecord/${record_id}`)
        .then((response) => {
          response.data.start_time = new Date(response.data.start_time)
          response.data.end_time = new Date(response.data.end_time)
          commit('setDataRecordWithDetails', response.data)
        })
        .catch((err) => {
          console.error(err)
        }) 
    },
  },

  mutations: {
    setDataRecords(state, dataRecords) {
      state.dataRecords = dataRecords
    },
    setDataRecordWithDetails(state, dataRecordWithDetails) {
      state.dataRecordWithDetails = dataRecordWithDetails
    },

  },


}