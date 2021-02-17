const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { response } = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/memeDB",{ useFindAndModify: false,useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(!err){
        console.log("DB connected");
    }else{
        console.log(err);
    }
});
// mongodb://localhost:27017/memeDB
const memeSchema={
    name:String,
    url:String,
    caption:String
}
const  Meme= mongoose.model("Meme", memeSchema);
app.route("/memes")
.get(function(req,res){
    Meme.find(function(err,result){
        if(err){
            res.send(err);
        }else{
           res.send(result);
        }
    }).sort({_id:-1}).limit(100);
})
.post(function(req,res){
    const meme=new Meme({
        name:req.body.name,
        url:req.body.url,
        caption:req.body.caption
    })
    meme.save(function(err,result){
        if(err){
            res.send(err);
        }else{
                const obj={
                    id:result._id
                }
            res.send(obj);
        }
    });
});
app.route("/home")
.get(function(req,res){
    Meme.find(function(err,result){
        res.render("home",{posts:result});
    }).sort({_id:-1}).limit(100);
})
.post(function(req,res){
    const meme=new Meme({
        name:req.body.name,
        url:req.body.url,
        caption:req.body.caption
    })
    meme.save(function(err,result){
        if(err){
            res.send(err);
        }else{
                const obj={
                    id:result._id
                }
            res.redirect("/home");
        }
    });
});
app.route("/memes/:memeid")
.get(function(req,res){
    Meme.find({_id:req.params.memeid},function(err,result){
        if(err){
            res.send(err);
        }else{
          res.send(result);
        }
    })
})
.post(function(req, res){
    console.log("patch request succesful");
    Meme.updateOne(
      {_id: req.params.memeid},
     req.body,
      function(err){
        if(!err){
          console.log("Successfully updated article.");
          res.redirect("/home");
        } else {
          res.render("404",{});
        }
      }
    );
})
.patch(function(req,res){
    Meme.replaceOne(
     {_id: req.params.memeid},
       req.body,
        function(err){
          if(!err){
            console.log("Successfully updated article.");
            res.redirect("/home");
          } else {
            console.log(err);
          }
        }
    );
})
app.get("/home",function(req,res){
    Meme.find(function(err,result){
        res.render("home",{posts:result});
    }).sort({_id:-1}).limit(100);
})
app.get("/",function(req,res){
    Meme.find(function(err,result){
        res.render("home",{posts:result});
    }).sort({_id:-1}).limit(100);
})
app.get("/postameme",function(req,res){
    res.render("postameme");
})
app.use(function(req,res){
    res.status(404);
    res.sendFile(__dirname+"/404.html");
})
app.listen(process.env.PORT||8081, function() {
  console.log("Server started on port 8081");
});