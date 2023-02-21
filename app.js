const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
// 取得資料庫連線狀態
const db = mongoose.connection
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入 Todo model
const Todo = require('./models/todo')


app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

app.get('/todos/new', (req,res) => {
  res.render('new')
})

app.post('/todos', (req,res) => {
// 從 req.body 拿出表單裡的 name 資料
  const name = req.body.name
// 存入資料庫
  return Todo.create({ name })
// 新增完成後導回首頁  
    .then(() => res.redirect('/')) 
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // 以 id 去尋找特定一筆 todo 資料
  return Todo.findById(id)
  // 用 lean() 把資料整理乾淨
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(()=> res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.post('/todos/:id/delete', (req,res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
    console.log(`I'm listening on localhost:${port}`)
})