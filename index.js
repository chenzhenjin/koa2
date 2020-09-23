const Koa = require("koa")
const app = new Koa()
const path = require("path")
const static = require("koa-static")
const bodyParse = require("koa-bodyparser")
const router = require("./router")
const cross = require("koa2-cors")


app.use(cross())
app.use(bodyParse())
let staticPath = './page'
app.use(static(path.join(__dirname,staticPath)))

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000,()=>{
  console.log("back-end running")
}) 