import api from '../../api'

const state = {
  workers: [],
  total: 0
}

const mutations = {
  SET_WORKERS(state, data) {
    state.workers = data.list
    state.total = data.total
  },
  ADD_WORKER(state, worker) {
    state.workers.unshift(worker)
    state.total++
  },
  UPDATE_WORKER(state, worker) {
    const index = state.workers.findIndex(w => w.id === worker.id)
    if (index !== -1) {
      state.workers[index] = worker
    }
  },
  DELETE_WORKER(state, id) {
    state.workers = state.workers.filter(w => w.id !== id)
    state.total--
  }
}

const actions = {
  async fetchWorkers({ commit }, params) {
    try {
      const response = await api.get('/workers', { params })
      commit('SET_WORKERS', { list: response.data, total: response.data.length })
    } catch (error) {
      console.error('获取工人数据失败:', error)
    }
  },
  async addWorker({ commit }, worker) {
    try {
      const response = await api.post('/workers', worker)
      commit('ADD_WORKER', response.data)
    } catch (error) {
      console.error('添加工人失败:', error)
    }
  },
  async updateWorker({ commit }, worker) {
    try {
      const response = await api.put(`/workers/${worker.id}`, worker)
      commit('UPDATE_WORKER', response.data)
    } catch (error) {
      console.error('更新工人信息失败:', error)
    }
  },
  async deleteWorker({ commit }, id) {
    try {
      await api.delete(`/workers/${id}`)
      commit('DELETE_WORKER', id)
    } catch (error) {
      console.error('删除工人失败:', error)
    }
  }
}

const getters = {
  workers: state => state.workers,
  total: state => state.total,
  onlineWorkers: state => state.workers.filter(w => w.status === 'online'),
  offlineWorkers: state => state.workers.filter(w => w.status === 'offline')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}