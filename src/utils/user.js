const users = []

const addUser = ({id, username, code}) => {
   username =  username.trim().toLowerCase()
   code = code.trim().toLowerCase()

if(!username || !code)
{
    return {
        error: "username and code are empty"
    }
} 
 const existingUser = users.find((user) => {
     return user.username === username && user.code === code
    }) 
 if(existingUser)
 {
    return {
        error: 'user is already added'
    }
 }
 const user = {id, username, code}
 users.push(user)
 return { user }
}

const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id)

    console.log(index)
    if(index === -1)
    {
        return {
            error: "user is not found"
        }  
    }
    return users.splice(index, 1)[0]
}

const getUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index === -1)
    {
        return {
            error: "user is not found"
        }  
    }
    return { user :users[index] }
}

const getUsersBycode = (code) => {

    const usersIncode = users.filter((user) => user.code == code)

    return usersIncode
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersBycode
}
