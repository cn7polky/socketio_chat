
let getHome, getLogin, postLogin, getRegister, postRegister, chatUrl, getForgot, postForgot
if (location.hostname === "localhost") {
    getHome = 'http://localhost:3333/home'
    getLogin = 'http://localhost:3333/sigin'
    postLogin = 'http://localhost:3333/login'
    getRegister = 'http://localhost:3333/signup'
    postRegister = 'http://localhost:3333/register'
    chatUrl = 'http://localhost:3333/auth/chat'
    getForgot = 'http://localhost:3333/forgot'
    postForgot = 'http://localhost:3333/forgot_password'
} else {
    getHome = 'https://realtime-chat-node.herokuapp.com/home'
    getLogin = 'https://realtime-chat-node.herokuapp.com/sigin'
    postLogin = 'https://realtime-chat-node.herokuapp.com/login'
    getRegister = 'https://realtime-chat-node.herokuapp.com/signup'
    postRegister = 'https://realtime-chat-node.herokuapp.com/register'
    chatUrl = 'https://realtime-chat-node.herokuapp.com/auth/chat'
    getForgot = 'https://realtime-chat-node.herokuapp.com/forgot'
    postForgot = 'https://realtime-chat-node.herokuapp.com/forgot_password'
}

function loadNav(page) {
    if (page === 'chat') {
        $("#container").load('../templates/navChat.html')
    } else {
        $("#container").load('../templates/nav.html')
    }
}

function sendAlert(message) {
    $('#status').html(message)
}

function removeAlert() {
    // let alert = document.getElementById('status')
    let alert = $('#status').html().length
    if (alert > 0)
        $('#status').html('')
}

function sendForm(form) {
    $(form).submit(function (event) {
        removeAlert()
        event.preventDefault()
        let dados = $(this).serialize()
        if (form === '#register') {
            console.log('Register')
            axios({
                method: 'post',
                url: postRegister,
                data: dados
            }).then(function (response) {
                // console.log(response)
                sendAlert(response.data.message)
                document.getElementById('register').reset()
            }).catch(function (error) {
                console.log(error)
            })
        } else if (form === '#login') {
            console.log('Login')
            axios({
                method: 'post',
                url: postLogin,
                data: dados
            }).then(function (response) {
                // console.log(response.data.user.name)
                if (response.data.user) {
                    localStorage.setItem('name', response.data.user.name)
                    let token = response.data.token
                    document.cookie = `Bearer=${token}`
                    document.location.replace(chatUrl)
                } else {
                    sendAlert(response.data.error)
                }

            }).catch(function (error) {
                console.log(error)
            })
        } else if (form === '#forgot_password') {
            removeAlert()
            $('#load_token').addClass('spinner')
            axios({
                method: 'post',
                url: postForgot,
                data: dados
            }).then(function (response) {
                // console.log(response)
                $('#load_token').removeClass('spinner')
                sendAlert(response.data.message)
            }).catch(function (error) {
                console.log(error)
            })
        }
    })
}

function go(url, form = 0) {
    removeAlert()
    axios({
        method: 'post',
        url: url,
        data: { auth: 'GO' },
        dataType: 'html'
    }).then(function (response) {
        //console.log(response)
        document.getElementById('container').innerHTML = response.data
        if (form)
            sendForm(form)
        $('div label').addClass('font-weight-bold')
        $('#form_content').addClass('col-sm-6 col-md-6 col-lg-4')
        if (url === getLogin)
            document.getElementById('forgot').addEventListener('click', () => go(getForgot, '#forgot_password'))
        // console.log('loginnnn')
    }).catch(function (error) {
        console.log(error)
    })
}

function verifyHost() {
    if (location.hostname === "localhost")
        console.log('Host atual: ' + location.hostname)
}

const user = localStorage.getItem('name')
$('#name').val(user)

$(document).ready(function () {
    const url_atual = window.location.href

    if (url_atual !== chatUrl) {
        document.getElementById('homelink').addEventListener('click', () => go(getHome))
        document.getElementById('registerlink').addEventListener('click', () => go(getRegister, '#register'))
        document.getElementById('loginlink').addEventListener('click', () => { go(getLogin, '#login') })
    }
    $("#container").load('../templates/home.html')
    function updateOnlineStatus() {
        let condition = navigator.onLine ? "ONLINE" : "OFFLINE";
        console.log(condition)
    }

    updateOnlineStatus()
    verifyHost()
    $('#load_content').remove()
    $('#nav').removeClass('hide')
    $('#container').removeClass('hide')

})