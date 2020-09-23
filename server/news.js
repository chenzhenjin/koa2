const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/vue")
const commentSchema = new mongoose.Schema({
  user_name: String,
  content: String,
  add_time: Number,
})
const newsSchema = mongoose.Schema({
  title: String,
  add_time: Number,
  content: String,
  click: Number,
  img_url: String,
  comment: [commentSchema]
  // comment:Array
})
const New = mongoose.model("New", newsSchema)
function newsFindAll() {
  return new Promise((resolve, reject) => {
    New.find({}, function (err, raw) {
      if (err) throw err
      console.log(raw)
      resolve(raw)
    })
  })
}
function newsFindOne(id) {
  return new Promise((resolve, reject) => {
    var _id = mongoose.mongo.ObjectId(id)
    New.update({ _id }, { $inc: { click: +1 } }, function (err, raw) {
      if (err) throw err
      console.log("newsFindOneclick", raw)
      New.find({ _id }, { title: true, click: true, add_time: true, content: true, _id: false },
        function (err, raw) {
          if (err) throw err
          console.log("newsFindOne", raw)
          resolve(raw)
        })
    })
  })
}
function commentFindAll(id) {
  return new Promise((resolve, reject) => {
    // articleInser()
    var _id = mongoose.mongo.ObjectId(id)//这里是特殊的hash值，而不是普通数字
    New.find({ _id }, { comment: true }).exec(function (err, raw) {
      if (err) throw err
      console.log("commentFindAll", raw[0].comment)
      resolve(raw[0].comment)
    })
  })
}

function commentInsert(id, body) {
  return new Promise((resolve, reject) => {
    var _id = mongoose.mongo.ObjectId(id)
    console.log(_id, body)
    New.update({ _id }, { $addToSet: { comment: body } }, function (err, raw) {
      if (err) throw err
      console.log("commentInsert", raw)
      resolve(true)
    })
  })
}

function articleInsert() {
  return new Promise((resolve,reject)=>{
    New.insertMany([
      {
        title: "koa2", add_time: 1589978382369, 
        content: "基于node开发web服务端框架",
        click: 1, img_url: "http://localhost:3000/static/img/koa.png",
        comment: [{ user_name: "chen", content: "让熟悉js的用户能接触到后端开发，进阶全栈", add_time: 1589979382369 }]
      },
      {
        title: "mongodb", add_time: 1589978382369, 
        content: "是一种非关系型数据库",
        click: 1, img_url: "http://localhost:3000/static/img/mongodb.jpg",
        comment: [{ user_name: "chen", content: "不用书写spl语句，而是大量方法进行数据增删改查", add_time: 1589979382369 }]
      },
      {
        title: "vue", add_time: 1589978382369, 
        content: "渐进式ui构建的前端框架，将模型中的数据绑定相关指令渲染到视图层，监听视图的事件改变模型的数据",
        click: 1, img_url: "http://localhost:3000/static/img/vue.png",
        comment: [{ user_name: "chen", content: "让用户更关注业务逻辑处理，减少传统大量操作dom提高页面性能", add_time: 1589979382369 }]
      }
    ],function(err,raw){
      if(err)throw err
      console.log(raw)
      resolve(true)
    })
  })
}
module.exports = { newsFindAll, newsFindOne, commentFindAll, commentInsert, articleInsert }
