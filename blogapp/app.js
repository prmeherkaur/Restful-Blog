var expresssanitizer=require("express-sanitizer"),
bodyparser= require("body-parser"),
mongoose=require("mongoose"),
methodoverride=require("method-override"),
express= require("express"),
app=express();
//APP MODEL

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));
//MONGOOSE MODEL
mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true });
var blogschema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,default:Date.now}
});
var blog=mongoose.model("blog",blogschema);
//RESTFUL ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
   
});
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            console.log("error");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/new", function(req,res){
    res.render("new");
});
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(error,foundblog){
        if(error){
            console.log("error");
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog: foundblog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(error,foundblog){
        if(error){
            console.log("error");
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog: foundblog});
        }
    });
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,foundblog){
        if(error){
            console.log("error");
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });

});
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("error");
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


app.listen(3000,function(req,res){
    console.log("server has started");
    //res.send("Startt");
});