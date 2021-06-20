const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload'); 
const path = require('path');
const ejs = require('ejs');
const fs = require('fs')
const Photo=require('./models/Photo')

const app=express()

//------------DB-------------------
mongoose.connect("mongodb://localhost/freelancer-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(()=>{
  console.log("db connected")
}).catch((error)=>
{
  console.log(error)
})

//------------TEMPLATE ENGİNE-----

app.set('view engine','ejs')

//------------MIDDLEWARE-----------

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(fileUpload())
app.use(methodOverride('_method',{methods: ['POST','GET']}))

//------------ROUTES-----------
app.get('/',async (req,res)=>{
  const photos=  await Photo.find({})
  res.render('index',{
    photos
  })
})

app.post("/photos", async (req, res) => {
  
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
     await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });
    res.redirect("/");
  });

});


app.delete('/photos/:id', async (req, res) => {
  const photos = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public/' + photos.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

app.put('/photos/:id', async (req, res) => {
 
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.description = req.body.description;
  photo.save()
  res.redirect(`/`);
});


app.get('/photos/edit/:id',async (req, res) => {  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});


app.get('/add',(req,res)=>{
  res.render('add')
})

const port =process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
