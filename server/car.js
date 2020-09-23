const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/vue")
const { Shop } = require("../server/shop")
const carSchema = mongoose.Schema({
  user_id: String,
  good_id: String,
  count: Number,
  selected: Boolean
})
const Car = mongoose.model("Car", carSchema)

function carFindAll(){
  return new Promise((resolve,reject)=>{
    Car.find({},{_id:0},function(err,raw){
      if(err)throw raw
      let goods_id = raw.map(item=>item.good_id)
      let carObj = {}
      raw.forEach(item=>{
        carObj[item.good_id]={good_id:item.good_id,user_id:item.user_id,count:item.count,selected:item.selected}
      })
      findShopAll(goods_id).then(array=>{
        let newArray = []
        array.forEach(item=>{
          let obj = {}
          let mongodbId = mongoose.Types.ObjectId(item._id)
          for(let key in carObj[mongodbId]){
            obj[key] =  carObj[mongodbId][key]
          }
          // delete item._doc._id
          obj = Object.assign(obj,{price:item._doc.sell_price})//从查询返回的结果在_doc里
          newArray.push(obj)
        })
        // console.log("carFindAll",newArray)
        resolve(newArray)
      })
    })
  })
}

function carFindShopAll(){
  return new Promise((resolve,reject)=>{
    Car.find({},{_id:0},function(err,raw){
      if(err)throw raw
      let goods_id = raw.map(item=>item.good_id)
      let carObj = {}
      raw.forEach(item=>{
        carObj[item.good_id]={good_id:item.good_id,user_id:item.user_id,count:item.count,selected:item.selected}
      })
      findShopAll(goods_id).then(array=>{
        let newArray = []
        array.forEach(item=>{
          let obj = {}
          let mongodbId = mongoose.Types.ObjectId(item._id)
          for(let key in carObj[mongodbId]){
            obj[key] =  carObj[mongodbId][key]
          }
          delete item._doc._id
          obj = Object.assign(obj,item._doc)//从查询返回的结果在_doc里
          newArray.push(obj)
        })
        // console.log("carFindShopAll",newArray)
        resolve(newArray)
      })
    })
  })
}

function findShopAll(goods_id) {
  return new Promise((resolve, reject) => {
    let _ids = goods_id.map(item=>mongoose.mongo.ObjectId(item))
    Shop.find({_id:{$in:_ids}}, {img_url:1,sell_price:1,stock_quantity:1,title:1}, 
    function (err,raw) {
      if(err)throw err
      resolve(raw)
    })
  })
}

function carUpdate(good_id,body){
  return new Promise((resolve,reject)=>{
    Car.update({good_id},body,function(err,raw){
      if(err)throw err
      console.log("carUpdate",raw)
      resolve(true)
    })
  })
}

function carDelete(good_id){
  return new Promise((resolve,reject)=>{
    Car.deleteOne({good_id},function(err,raw){
      if(err) throw err
      console.log("carDelete",raw)
      resolve(true)
    })
  })
}

function carInsertOne(body){
  return new Promise((resolve,reject)=>{
    body.user_id = '1'
    Car.insertMany(body,function(err,raw){
      if (err) throw err
        console.log("carInsertOne", raw)
        resolve(true)
    })
  })
}

function carInsert(body) {
  return new Promise((resolve, reject) => {
    Car.insertMany([
      { user_id: "1", good_id: "5ec609c982c5470b4c085487", count: 1, selected: true },
      { user_id: "1", good_id: "5ec609c982c5470b4c085488", count: 1, selected: true }],
      function (err, raw) {
        if (err) throw err
        console.log("carInsert", raw)
        resolve(true)
      })
  })
}
// {user_id:"1",good_id:"5ec609c982c5470b4c085487",imr_url:"http://localhost:3000/static/img/vue.png",title:"华为手机",
// sell_price:2000,stock_quantity:200,count:1,selected:true}

module.exports = { carInsert,carFindShopAll,carFindAll,carUpdate,carDelete,carInsertOne }