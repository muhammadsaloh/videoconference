let socket = io();
let peer = new Peer()

peer.on('open', id => {
    socket.emit('peer', id)
})

const idSpanElement = document.getElementById('idSpanElement');
const myVideoElement = document.getElementById('myVideo');
const friendIdForm = document.getElementById('friendIdForm');
const inputDataElement = document.getElementById('inputDataElement')
const friendVideo = document.getElementById('friendVideo');

;(async () => {
    let data = await window.navigator.mediaDevices.getUserMedia({
        video: true, audio: false, peerIdentity: true
    })
    myVideoElement.srcObject = data
})()

socket.on('ulanish', id => {
    idSpanElement.textContent = id
});

friendIdForm.addEventListener('submit', event => {
    event.preventDefault()

    socket.emit('call', inputDataElement.value.trim())
})

socket.on('error', e => alert(e))

socket.on('call', e => {
    var conn = peer.connect(e);
    conn.on('open', async () => {
        let data = await window.navigator.mediaDevices.getUserMedia({
            video: true, audio: false, peerIdentity: true
        })
        let call = await peer.call(e, data)
        call.on('stream', remoteStream => {
            friendVideo.srcObject = remoteStream
        })
    })
})

peer.on('call', async call => {
    let data = await window.navigator.mediaDevices.getUserMedia({
        video: true, audio: false, peerIdentity: true
    })
    call.answer(data)
    call.on('stream', function (remoteStream) {
        friendVideo.srcObject = remoteStream
    })
})