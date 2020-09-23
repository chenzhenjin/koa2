const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/react")

const movieSchema = mongoose.Schema({
  images: { small: String },
  title: String,
  genres: { type: Array, require: true },
  rating: { average: Number },
  id: String,
  type: String
})
const Movie = mongoose.model("Movie", movieSchema)

function movieInsert(subjects) {
  return new Promise((resolve, reject) => {
    Movie.insertMany(subjects, function (err, raw) {
      if (err) throw err
      console.log("insertMany", raw)
      resolve(true)
    })
  })
}

function movieRegexFind(search,query){
  return new Promise((resolve,reject)=>{
    const reg = new RegExp(search, 'i')//不区分大小写
    Movie.find({title:{$regex:reg}},{_id:0}).exec(function(err,raw){
      if (err) throw err
      let total = raw.length
      console.log("movieRegexFind total", raw.length)
      Movie.find({title:{$regex:reg}},{_id:0}).limit(query.count).skip(query.start)
      .exec(function(err,raw){
        if (err) throw err
        let obj = {
          subjects: raw,
          total
        }
        console.log("movieRegexFind", raw)
        resolve(obj)
      })
    })
  })
}

function movieTypeFind(type, query) {
  return new Promise((resolve, reject) => {
    Movie.find({ type }, { _id: 0 }).exec(function (err, raw) {
      if (err) throw err
      let total = raw.length
      console.log("movieTypeFindAll total", raw)
      Movie.find({ type }, { _id: 0 }).limit(query.count).skip(query.start)
      .exec(function (err, raw) {
        if (err) throw err
        let obj = {
          subjects: raw,
          total
        }
        console.log("movieTypeFind", raw)
        resolve(obj)
      })
    })
  })
}
module.exports = { movieInsert, movieTypeFind,movieRegexFind }