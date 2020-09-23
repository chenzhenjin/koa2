const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/react")

const historySchema = mongoose.Schema({
  name: String,
  imgUrl: String,
  end_time: Number
})
History = mongoose.model("History", historySchema) 

function insertOne(body) {
  return new Promise((resolve, reject) => {
    findExist(body.name).then(res=>{
      if(!res){ 
        History.insertMany([body], function (err, raw) {
          if (err) throw err
          console.log("histories insertOne", raw)
          resolve(true)
        })
        resolve({des:"添加成功",code:1})
      }else{
        History.update({name:body.name},{$set:{end_time:body.end_time}},function(err,raw){
          if (err) throw err
          console.log("histories upate", raw)
          resolve(true)
        })
        resolve({des:"已更新最后浏览时间",code:0})
      }
    })
  })
}

function findAll() {
  return new Promise((resolve, reject) => {
    History.find({}, { name: true, imgUrl: true, end_time:true })
    .sort({end_time:-1}).exec(function (err, raw) {
      if (err) throw err
      resolve(raw)
    })
  })
}
function findExist(name) {
  return new Promise((resolve, reject) => {
    History.find({ name }, function (err, raw) {
      if (err) throw err
      console.log("findExist", raw)
      if(Array.isArray(raw)){
        raw.length != 0 ? resolve(true) : resolve(false)
      }else{
        resolve(false)
      }
    })
  })
}

function cleanAll(){
  return new Promise((resolve,reject)=>{
    History.remove({},function(err,raw){
      if(err)throw raw
      console.log("cleanAll",raw)
      resolve(true)
    })
  })
}
module.exports = { insertOne, findAll, findExist,cleanAll }


