import api from '../../api'

const state = {
  alarms: [],
  alarmCount: 0
}

const mutations = {
  SET_ALARMS(state, data) {
    state.alarms = data
    state.alarmCount = data.filter(a => !a.handled).length
  },
  MARK_HANDLED(state, id) {
    const alarm = state.alarms.find(a => a.id === id)
    if (alarm) {
      alarm.handled = true
      state.alarmCount--
    }
  }
}

const actions = {
  async fetchAlarms({ commit }) {
    try {
      const response = await api.get('/alarms')
      commit('SET_ALARMS', response.data)
    } catch (error) {
      console.error('获取告警数据失败:', error)
    }
  },
  async handleAlarm({ commit }, id) {
    try {
      await api.put(`/alarms/${id}/handle`)
      commit('MARK_HANDLED', id)
    } catch (error) {
      console.error('处理告警失败:', error)
    }
  }
}

const getters = {
  alarms: state => state.alarms,
  unhandledAlarms: state => state.alarms.filter(a => !a.handled),
  handledAlarms: state => state.alarms.filter(a => a.handled)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}