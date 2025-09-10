const express = require("express");
const ejsMate=require("ejs-mate");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const Listing = require("./models/listings.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//its a middelware//it is for post request to acces req.body when comimg from url here
app.use(express.json());
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const mongurl="mongodb://127.0.0.1:27017/wonderlust";
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const asyncwrap=require("./utils/wrapasyc.js");
const ExpressError=require("./utils/expresserror.js");
const {listingSchema}=require("./schema.js")

main()
.then(()=>{

    console.log("conneted");
}).catch((err)=>{
    console.log(err);
});


async function main() {
   await mongoose.connect(mongurl);
}

app.listen(port,()=>{
    console.log("server is listening");
});

const validatelisting=(req,res,next)=>{
    console.log(req.body);
     console.log(listingSchema);

const {error}=listingSchema.validate(req.body);

if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errmsg);
}
else{
    next();
}
}
app.get("/",(req,res)=>{
    
        res.render("listings/home.ejs");
    
    
});



/*app.get("/testlist",async(req,res)=>{
    let samplelist=new listing({
        title: "janther manther",
        discription:"near new delhi",
price: 1200,
location:  "delhi" ,
country:"india ",
    });
 await samplelist.save();
 console.log("sample list added");
 res.send(" successfully runned");

});*/
app.get("/listings",asyncwrap(async(req,res)=>{
    const alllistings=await Listing.find({ });
        res.render("listings/index.ejs",{alllistings});
    
    
}));

app.get("/listings/new",(req,res)=>{  // here if write the this route after get request of/listing/:id then it will first check that route i mean check for new named id so to avoid this mistake we write this route above that route
    
res.render("listings/new.ejs");
});/*
app.post("/listings",asyncwrap(async(req,res,next)=>{
    console.log(req.body);
if (!req.body.listing) {
    console.log("no listing");
    throw new ExpressError(400, "Send valid data for listing");
  }
    if (!req.body.listing.title) {
    console.log("no title");
    throw new ExpressError(400, "enter title");
  }
    if (!req.body.listing.description) {
    console.log("no descrition");
    throw new ExpressError(400, "enter description");
  }
const newlisting=new Listing(req.body.listing);
await newlisting.save();
res.redirect("/listings");}
));*/
app.post("/listings",validatelisting,asyncwrap(async(req,res,next)=>{
    
const newlisting=new Listing(req.body.listing);
await newlisting.save();
res.redirect("/listings");}
));

app.get("/listings/:id/edit",asyncwrap(async(req,res)=>{
let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",validatelisting,asyncwrap(async(req,res)=>{
let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);

}));

app.delete("/listings/:id",asyncwrap(async(req,res)=>{
    let {id}=req.params;
      let  deletedlist=  await Listing.findByIdAndDelete(id);
      console.log(deletedlist);
      res.redirect("/listings");
}));

app.get("/listings/:id",asyncwrap(async(req,res,next)=>{
    let {id}=req.params;
    const listening= await Listing.findById(id);
res.render("listings/show.ejs",{listening});
}));
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="some thing went wrong"}=err;
    res.status(status).render("listings/error.ejs",{message});
});
