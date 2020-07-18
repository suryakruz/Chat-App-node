const socket = io.connect();

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormButton = document.querySelector('button')
const $messageFormInput = document.querySelector('input')
const $sendLocation = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// query String
const {username, code} = Qs.parse(location.search, {ignoreQueryPrefix: true})



$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const value = e.target.elements.message.value
    socket.emit('sendMessage', value, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error)
        {
            console.log(error)
        }
        else
        {
            console.log('Message Delivered')
        }
    })
})

$sendLocation.addEventListener('click', ()=>{
    $sendLocation.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation)
    {
        return alert('No Geolocation support in this browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, ()=>{
            $sendLocation.removeAttribute('disabled')
            console.log("Location shared")
        })
    })
})
// handle events

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("hh:mm A"),
        username : message.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (url) =>{
    const html = Mustache.render(locationTemplate, {
        url : url.text,
        createdAt: moment(locationTemplate.createdAt).format("hh:mm A") ,
        username : url.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('sidebarData', (data) => {
    const html  = Mustache.render(sidebarTemplate, {
        code : data.code,
        users: data.users
    })
    $sidebar.innerHTML = html
})

socket.emit('join', {username, code}, (error)=>{
    if(error)
    {
        alert("UserName is taken")
        location.href = "/"
    }
})

const autoscroll = ()=>{
    $messages.scrollTop = $messages.scrollHeight
}

