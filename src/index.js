const express=require('express')
require('./db/mongoose')
const userRouter=require('./router/user')
const taskRouter=require('./router/task')

const app=express()
const port=process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is up on port '+port)
})


// const jwt=require('jsonwebtoken')

// const fun=function () {
    
//     const token=jwt.sign({_id:'abcd123'},'secretText',{expiresIn:'7 days'})
//     console.log(token)


//     const data=jwt.verify(token,'secretText')
//     console.log(data)    
// }

// fun()