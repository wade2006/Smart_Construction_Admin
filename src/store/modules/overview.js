import api from "../../api";

const state = {
  overviewData: {
    airQuality: {},
    dustData: {},
    towerCrane: {},
    statistics: {},
  },
  chartData: {
    airQualityHistory: [],
    dustHistory: [],
    towerCraneStatus: [],
  },
};

const mutations = {
  SET_OVERVIEW_DATA(state, data) {
    state.overviewData = data;
  },
  SET_CHART_DATA(state, data) {
    state.chartData = data;
  },
};

const actions = {
  async fetchOverviewData({ commit }) {
    try {
      const response = await api.get("/overview");
      commit("SET_OVERVIEW_DATA", response.data.data);
    } catch (error) {
      console.error("获取概览数据失败:", error);
    }
  },
  async fetchChartData({ commit }) {
    try {
      const response = await api.get("/overview/chart");
      commit("SET_CHART_DATA", response.data.data);
    } catch (error) {
      console.error("获取图表数据失败:", error);
    }
  },
};

const getters = {
  overviewData: (state) => state.overviewData,
  chartData: (state) => state.chartData,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
