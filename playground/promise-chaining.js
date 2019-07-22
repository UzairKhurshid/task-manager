require('../src/db/mongoose')
const User=require('../src/models/user')
const Task=require('../src/models/task')

//promise chaining
// User.findByIdAndUpdate('5d286ad00648e1042079959e',{name:'uzairkhurshid'}).then((user)=>{
//     console.log(user)
//     return Task.findByIdAndUpdate('5d286eaec153e50e68c1426c',{description:'updated desc1'})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })


//Async await 

const findAndUpdate=async (id1,id2,age,description)=>
{
    const updateUser=await User.findByIdAndUpdate(id1,{age})
    const updateTask=await Task.findByIdAndUpdate(id2,{description})
    return updateTask
}

findAndUpdate('5d286ad00648e1042079959e','5d286eaec153e50e68c1426c',25,'descUpdated').then((task)=>{
    console.log(task)
}).catch((error)=>{
    console.log(error)
})
