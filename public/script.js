// js from frontend is going to live

// video element that shows our video in page

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted =  true;

var myPeer = new Peer(undefined,{
    path:'/peer.js',
    host:'/',
    port:'443'
});

let myVideoStream;

//ability to fetch video and audio functions with getUserMedia promise
navigator.mediaDevices.getUserMedia({  
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream; // we are executing video streaming
    addVideoStream(myVideo,stream);

    myPeer.on('call',call =>{
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream); // connecting with newUser using socket.io
    })

    
        let text = $('input')

        $('html').keydown((e)=>{
            if(e.which==13 && text.val().length!==0)
            {
                console.log(text.val());
                socket.emit('message',text.val());
                text.val('');
            }
        });

        socket.on('createMessage',message=>{
            
            $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        })

});


myPeer.on('open',id => {
    socket.emit('join-room',ROOM_ID, id);// room id which we have to join

})


const connectToNewUser = (userId, stream) =>{
    const call  = myPeer.call(userId,stream); //calling user sharing my stream
    const video = document.createElement('video') //creating a new video element for user
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream) // adding a new user to our stream
    })
}
  

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;

    // to play video
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })

    videoGrid.append(video);
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled)
    {
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnMuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton = () =>{
    const html =   `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `

    document.querySelector('.main_mute_button').innerHTML=html;
}

const setUnMuteButton = () =>{
    const html =   `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>UnMute</span>
    `

    document.querySelector('.main_mute_button').innerHTML=html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled)
    {
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}


const setStopVideo = () =>{
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `

    document.querySelector('.main_video_button').innerHTML=html;
}

const setPlayVideo = () =>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `

    document.querySelector('.main_video_button').innerHTML = html;
}