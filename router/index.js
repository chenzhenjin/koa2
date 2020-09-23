const Router = require("koa-router")
let reactMovie = new Router()
let vueShop = new Router()
let router = new Router()
const { findAll, insertOne, cleanAll } = require("../server/history")
const { newsFindAll, newsFindOne, commentFindAll, commentInsert, articleInsert } = require("../server/news")
const { shopInsert, shopsFindAll, shopsFindOne } = require("../server/shop")
const { carInsert, carFindShopAll, carFindAll, carUpdate, carDelete, carInsertOne } = require("../server/car")
const { movieInsert, movieTypeFind,movieRegexFind} = require("../server/movie")
const mongoose = require("mongoose")
const axios = require("axios")
function swichReactDB(dbName) {
  if (swichReactDB.react) {
    return new Promise((resolve, reject) => { resolve(true) })
  }
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://localhost/" + dbName, err => {
      if (err) throw err
      console.log("react connect")
      swichReactDB.react = true
      swichVueDB.vue = false
      resolve(true)
    })
  })
}
function swichVueDB(dbName) {
  if (swichVueDB.vue) {
    return new Promise((resolve, reject) => { resolve(true) })
  }
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://localhost/" + dbName, err => {
      if (err) throw err
      console.log("vue connect")
      swichReactDB.react = false
      swichVueDB.vue = true
      resolve(true)
    })
  })
}
function moivesAxios(url, methods) {
  return new Promise((resolve, reject) => {
    let apikey = "0df993c66c0c636e29ecbb5344252a4a"
    if (methods === 'get') {
      axios.get(`http://api.douban.com/v2/${url}?count=100&apikey=${apikey}`).then(res => {
        let filterData = {}
        filterData.total = res.data.total
        filterData.subjects = res.data.subjects.map(item => {
          let obj = {}
          obj.images = {small:""}
          obj.images.small = item.images.small
          obj.title = item.title
          obj.genres = item.genres
          obj.rating = {average:0}
          obj.rating.average = item.rating.average
          obj.id = item.id
          obj.type = url.split('/')[1]
          return obj
        })
        resolve(filterData) 
      })
    }
  })
}
reactMovie.get('history', async (ctx) => {
  let connect = await swichReactDB(ctx.url.split('/')[1])
  let data = await findAll()
  console.log("findAll get", data)
  ctx.body = data
}).post('history/add', async (ctx) => {
  let connect = await swichReactDB(ctx.url.split('/')[1])
  let data = ctx.request.body
  let res = await insertOne(data)
  ctx.body = res
}).post("history/clean", async (ctx) => {
  let connect = await swichReactDB(ctx.url.split('/')[1])
  let res = await cleanAll()
  ctx.body = res
}).get("movie/:type", async (ctx) => {
  let connect = await swichReactDB(ctx.url.split('/')[1])
  let query = {count: +ctx.query.count , start: +ctx.query.start}
  let type = ctx.params.type
  let res = {}
  if(type === "search_result"){
    res = await movieRegexFind(ctx.query.search,query)
  }else{
    res = await movieTypeFind(type,query)
  }
  // let url = ctx.url.split('/')[2] + '/' + ctx.url.split('/')[3]
  // let data = await moivesAxios(url, "get")
  // console.log("movie/in_theaters", data)
  // let res = await movieInsert(data.subjects)
  ctx.body = res
})

vueShop.get('shop/list', async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let list = await shopsFindAll()
  let data = {
    code: 1,
    list
  }
  ctx.body = data
}).get("shop/info", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let id = ctx.query.id
  let info = await shopsFindOne(id)
  // let info = {title:"华为手机",sell_price:2000,market_price:2500,stock_quantity:200,add_time:1590033781425,goods_no:"1520",
  // lunbotu:["http://localhost:3000/static/img/vue.png","http://localhost:3000/static/img/koa.jpg"]}
  let data = {
    code: 1,
    info
  }
  ctx.body = data
}).get("shop/add", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let res = await shopInsert()
  if (res) {
    ctx.body = "shop success add"
  } else {
    ctx.body = "shop fail add"
  }
}).get("car/shop-list", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let list = await carFindShopAll()
  console.log("car/shop-list", list)
  let data = {
    code: 1,
    list
  }
  ctx.body = data
}).get("car/list", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let list = await carFindAll()
  console.log("car/list", list)
  let data = {
    code: 1,
    list
  }
  ctx.body = data
}).post("car/update", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let body = ctx.request.body
  let good_id = body.good_id
  delete body.good_id
  let res = await carUpdate(good_id, body)
  console.log("car/update", good_id, body)
  let data = {
    code: 0
  }
  if (res) { data.code = 1 }
  ctx.body = data
}).post("car/delete", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let good_id = ctx.request.body.good_id
  console.log("car/delete", good_id)
  let res = await carDelete(good_id)
  let data = {
    code: 0
  }
  if (res) { data.code = 1 }
  ctx.body = data
}).post("car/add", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let body = ctx.request.body
  console.log("car/add", body)
  let res = await carInsertOne(body)
  let data = {
    code: 0
  }
  if (res) { data.code = 1 }
  ctx.body = data
}).get("car/add", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let res = await carInsert()
  if (res) {
    ctx.body = "car success add"
  } else {
    ctx.body = "car fail add"
  }
}).get('img/lunbo', async (ctx) => {
  let data = {
    code: 1,
    list: ["http://106.52.147.170:3000/static/img/scenery.jpg",
      "http://106.52.147.170:3000/static/img/shopcar.gif",
      "http://106.52.147.170:3000/static/img/news.jpg"]
  }
  ctx.body = data
}).get("news/list", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let list = await newsFindAll()
  let data = {
    code: 1,
    list
  }
  ctx.body = data
}).get("news/info", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let id = ctx.query.id
  let infoArr = await newsFindOne(id)
  let data = {
    code: 1,
    info: infoArr[0]
  }
  ctx.body = data
}).get("comment/list", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let id = ctx.query.id
  let list = await commentFindAll(id)
  let data = {
    code: 1,
    list
  }
  ctx.body = data
}).post("comment/add", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let id = ctx.query.id
  let body = ctx.request.body
  let res = await commentInsert(id, body)
  let data = {
    code: 0
  }
  if (res) {
    data.code = 1
  }
  ctx.body = data
}).get("article/add", async (ctx) => {
  let connect = await swichVueDB(ctx.url.split('/')[1])
  let res = await articleInsert()
  if (res) {
    ctx.body = 'success add'
  } else {
    ctx.body = 'fail add'
  }
})

router.use('/vue/', vueShop.routes(), vueShop.allowedMethods())
router.use('/react/', reactMovie.routes(), reactMovie.allowedMethods())

module.exports = router