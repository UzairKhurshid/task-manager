const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail , sendCancelEmail}=require('../emails/accounts')

const router=new express.Router()

//create
router.post('/users',async(req,res)=>{
    const user =new User(req.body)
    try
    {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateToken()
        res.status(200).send({user,token})
    }catch(e)
    {
        res.status(400).send(e)
    }
})

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateToken()
        res.status(200).send({ user: user.getrequiredData(),token})
    } catch (e) {
        res.status(400).send()
    }
})

//logout 

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})


//read

router.get('/users/me',auth,async(req,res)=> {

   res.send(req.user)
})

//update
router.patch('/users/me',auth,async (req,res)=>{
    
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validUpdates=updates.every((update)=>allowedUpdates.includes(update))
    
    if(!validUpdates)
    {
        return res.status(400).send('error:not a valid update')
    }


    try
    {
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()
       
        res.send(req.user)
    }catch(e)
    {
        res.status(400).send(e)
    }
})

//delete
router.delete('/users/me',auth,async (req,res)=>{

    try
    {
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(e)
    {
        res.status(400).send(e)
    }
})

//profile upload
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return callback(new Error('file should be of jpg '))
        }
        callback(undefined,true)
    }
})
router.post('/users/me/avatar',auth , upload.single('upload'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message })
})

//profile delete
router.delete('/users/me/avatar',auth,async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.status(200).send('deleted')
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports=router
