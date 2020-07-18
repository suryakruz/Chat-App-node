const generateMessage = (text, username)=>{
   return {
        text : text,
        createdAt: new Date().getTime(),
        username : username
   }
}


module.exports = { generateMessage}