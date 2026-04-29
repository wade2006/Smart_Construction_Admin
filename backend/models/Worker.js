/*
 * @Author: zengjunwen 1121157674@qq.com
 * @Date: 2026-04-28 18:49:15
 * @LastEditors: zengjunwen 1121157674@qq.com
 * @LastEditTime: 2026-04-29 10:58:08
 * @FilePath: \05_Project_Admin\backend\models\Worker.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Worker 模型
const Worker = mongoose.model(
  "Worker",
  new mongoose.Schema({
    name: String,
    workerId: String,
    position: {
      type: String,
      enum: ["worker", "foreman", "engineer", "manager"],
    },
    department: String,
    phone: String,
    status: { type: String, enum: ["online", "offline"], default: "online" },
    joinDate: String,
    avatar: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  }),
);
