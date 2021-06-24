const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/wiki");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")



    .get(function (req, res) {

        Article.find({}, function (err, foundArticles) {
            if (err) {
                res.send(err)
            } else {
                res.send(foundArticles)
            }
        })

        // res.render("list",{heading : articles})
    })



    .post(function (req, res) {
        // console.log(req.body.title);
        // console.log(req.body.content)

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Succsessfully added");
            } else {
                res.send(err)
            }
        })
    })



    .delete(function (req, res) {

        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted")
            } else {
                res.send(err)
            }
        })
    });
/////////////////////// rote for particular article


app.route("/articles/:articleTitle")

    .get(function (req, res) {
        console.log(req.params.title)

        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle)
            } else {
                res.send("No Match")
            }
        })
    })

    .put(function (req, res) {
        Article.update({ title: req.params.articleTitle },
            { title: req.body.title,
                 content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully Updated")

                }
            })
    })

    .patch(function(req,res){

  Article.update({title : req.params.articleTitle},
    
    {$set : req.body},function(err){
        if(!err){
            res.send("Patched succesfully")
        }else{
            res.send(err)
        }
    })

    })

    .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle},function(err){
            if(!err){
                res.send("deleted")
            }else{
                res.send(err)
            }
        })
    })








// app.get("/articles",function(req,res){

//     Article.find({},function(err,foundarticles){
//       if(err){
//           res.send(err)
//       }else{
//         res.send(foundarticles)
//       }
//     })

//     // res.render("list",{heading : articles})
// })

// app.post("/articles",function(req,res){
//     // console.log(req.body.title);
//     // console.log(req.body.content)

//     const newArticle = new Article({
//         title: req.body.title ,
//         content: req.body.content
//     })

//     newArticle.save(function(err){
//       if(!err){
//           console.log("Succsessfully added");
//       }else{
//           console.log(err)
//       }
//     })
// })


// app.delete("/articles",function(req,res){

//     Article.deleteMany({},function(err){
//         if(!err){
//             res.send("Successfully deleted")
//         }else{
//             res.send(err)
//         }
//     })
// })

app.listen(3000, function () {
    console.log("server started")
})