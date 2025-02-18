import express from 'express'
require('dotenv').config()
import cors from 'cors'
import initRouter from './src/routes'
import connectDatabase from './src/config/connectDatabase'
import { getNumberFromString } from './src/utils/common'

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST','GET','PUT','DELETE']
}))

//cấu hình để đọc được dữ liệu từ client gửi lên
app.use(express.json())
app.use(express.urlencoded({extended: true}))
initRouter(app)
connectDatabase()
const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})

