import { createStore } from 'vuex'
import overview from './modules/overview'
import alarm from './modules/alarm'
import workers from './modules/workers'

export default createStore({
  modules: {
    overview,
    alarm,
    workers
  }
})