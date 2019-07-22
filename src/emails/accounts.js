const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'sardar.uzair12@gmail.com',
        subject:'Welcome ,${name}',
        text:'Welcome to task-Manager App'
    })
}


const sendCancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'sardar.uzair12@gmail.com',
        subject:'Welcome ,${name}',
        text:'Your Account is successfully removed'
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}