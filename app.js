const express = require('express')
const mongoose = require('mongoose')
const app = express()
const exphbs = require('express-handlebars')
// 載入 Todo model
const Todo = require('./models/todo')


app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const port = 3000
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
// 取出 Todo model 裡的所有資料
Todo.find()
// 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .lean()
// 將資料傳給 index 樣板
    .then(todos => res.render('index',{todos}))
// 錯誤處理
    .catch(error => console.error(error))
}) 

app.listen(port, () => {
    console.log(`I'm listening on localhost:${port}`)
})