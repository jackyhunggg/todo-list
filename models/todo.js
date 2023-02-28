// 第一行先把 mongoose 載入進來，才能使用相關方法
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 把想要的資料結構當成參數傳給 new Schema()
const todoSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
    // 預設初始狀態為還沒被完成
        default: false,
    },
})
// mongoose.model 會複製我們定義的 Schema 並編譯成一個可供操作的 model 物件
// 匯出的時候我們把這份 model 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了
module.exports = mongoose.model('Todo', todoSchema)