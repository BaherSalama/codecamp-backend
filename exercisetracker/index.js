const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser= require('body-parser');
const mongoose = require("./db.js").mongoose;

require('dotenv').config()

//connect database
mongoose.connect(process.env.MONGO_URI, {});

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const User = require("./db.js").User;

app.post('/api/users',async (req,res)=>{
  try{
    const user = new User({username:req.body.username});
    await user.save();
    res.json({username:user.username, _id: user.id})
  }catch(err){
    res.json({error:err})
  };
})
app.get('/api/users',async (req,res)=>{
  try{
    const users = await User.find();
    console.log(users)
    res.send(users)
  }catch(err){
    console.log(err)
    res.json({error:err})
  };
})


async function logmiddleware(req,res,next){
  try{
    let exercise
    if (req.body.date){
    }else{
      exercise = new Exercise({
        date:new Date().toDateString(),
        description:req.body.description,
        duration:req.body.duration,
        username:req.body.username,
        _id:req.params.id
      });
    }
    await exercise.save()
    res.send(exercise)
  }catch(err){
    console.log(err)
    res.json({error:err})
  };
}


const Exercise = require("./db.js").Exercise;




app.post("/api/users/:id/exercises",async (req,res)=>{
  try{
    let user = await User.findById(req.params.id)
    let exercise
    if (req.body.date){
      exercise = new Exercise({
        date:new Date(req.body.date).toDateString(),
        description:req.body.description,
        duration:req.body.duration,
        user:req.params.id
      });
    }else{
      exercise = new Exercise({
        date:new Date().toDateString(),
        description:req.body.description,
        duration:req.body.duration,
        username:req.body.username,
        user:req.params.id
      });
    }
    await exercise.save()

    res.send({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
      _id: user._id
    })
  }catch(err){
    console.log(err)
    res.json({error:err})
  };
})


app.get('/api/users/:id/logs',async (req,res)=>{
  try{
    const logs = await Exercise
    .find({user:req.params.id}).limit(req.query.limit)
    .where(`date > ${req.query.from}`)
    .where(`date < ${req.query.to}`)
    .select("-_id description duration date");
    // const user = await User.findOne({_id:req.params.id});
    let user = await User.findById(req.params.id);
    res.send({
      username: user.username,
      count: logs.length,
      _id: req.params.id,
      log: logs
    })
  }catch(err){
    console.log(err)
    res.json({error:err})
  };
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
