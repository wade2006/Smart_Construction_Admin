/*
 * @Author: zengjunwen 1121157674@qq.com
 * @Date: 2026-04-28 18:49:12
 * @LastEditors: zengjunwen 1121157674@qq.com
 * @LastEditTime: 2026-04-28 18:52:54
 * @FilePath: \05_Project_Admin\backend\models\Alarm.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require('mongoose')

const alarmSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: { type: String, enum: ['danger', 'warning', 'info'] },
  location: String,
  time: String,
  handled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Alarm', alarmSchema)
