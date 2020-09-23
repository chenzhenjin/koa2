const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/vue")

const shopSchema = mongoose.Schema({
  title:String,
  sell_price:Number,
  market_price:Number,
  stock_quantity:Number,
  img_url:String,
  add_time:Number,
  goods_no:String,
  lunbotu:{
    type:Array,
    require:true
  }
})
const Shop = mongoose.model("Shop",shopSchema)

function shopsFindAll(){
  return new Promise((resolve,reject)=>{
    Shop.find({},{title:true,sell_price:true,
      market_price:true,stock_quantity:true,img_url:true},function(err,raw){
        if(err)throw err
        console.log("shopsFindAll",raw)
        resolve(raw)
      })
  })
}

function shopsFindOne(id){
  return new Promise((resolve,reject)=>{
    let _id = mongoose.mongo.ObjectId(id)
    Shop.find({_id},{title:true,sell_price:true,
      market_price:true,stock_quantity:true,
      add_time:true,goods_no:true,lunbotu:true,_id:false},function(err,raw){
        if(err)throw err
        console.log("shopsFindOne",raw[0])
        resolve(raw[0])
      })
  })
}

function shopInsert(){
  return new Promise((resolve,reject)=>{
    // let list = [
    //   { title:"华为p40",sell_price:4488,market_price:5088,
    //   stock_quantity:200,img_url:"http://106.52.147.170:3000/static/img/p40-1.jpg",
    //   add_time:1590073103683,goods_no:"0001",
    //   lunbotu:["http://106.52.147.170:3000/static/img/p40-2.jpg","http://106.52.147.170:3000/static/img/p40-1.jpg"]},
    //   {title:"小米10",sell_price:4299,market_price:5088,
    //   stock_quantity:200,img_url:"http://106.52.147.170:3000/static/img/xiaomi10-1.jpg",
    //   add_time:1590073103683,goods_no:"0002",
    //   lunbotu:["http://106.52.147.170:3000/static/img/xiaomi10-1.jpg","http://106.52.147.170:3000/static/img/xiaomi10-2.jpg"]}
    // ]
    Shop.insertMany(
      [{ title:"苹果手机11 ",sell_price:6000,market_price:7000,
      stock_quantity:200,img_url:"http://106.52.147.170:3000/static/img/iphone11-2.jpg",
      add_time:1590073103683,goods_no:"0003",
      lunbotu:["http://106.52.147.170:3000/static/img/iphone11-2.jpg","http://106.52.147.170:3000/static/img/iphone11-1.jpg"]},]
      ,function(err,raw){
        if(err)throw raw
        console.log("shopInsert ",raw)
        resolve(true)
      })
  })
}
module.exports = {shopInsert,shopsFindAll,shopsFindOne,Shop}
