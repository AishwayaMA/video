//code for audio,video,leave meeting options 
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;


const user = prompt("Please enter your name");

var peer = new Peer(undefined, {
  
});
const peers={}
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    //user has joined
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

  //user has disconnected
  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  });

  peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
  });

//connecting to a new uer
const connectToNewUser = (userId, stream) =>
 {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  })

  call.on('close', () => {
    video.remove() // remove video when user disconnects
  })

  peers[userId] = call

};

//adding and appending videos 
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};


const backBtn = document.querySelector(".header__back");
backBtn.addEventListener("click", () => {
    document.querySelector(".main__left").style.display = "flex";
    document.querySelector(".main__left").style.flex = "1";
    document.querySelector(".main__right").style.display = "none";
    document.querySelector(".header__back").style.display = "none";
  });
  
 
  const inviteButton = document.querySelector("#inviteButton");
  const muteButton = document.querySelector("#muteButton");
  const stopVideo = document.querySelector("#stopVideo");
  
  //audio mute/unmute options
  muteButton.addEventListener("click", () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      html = `<i class="fas fa-microphone-slash"></i>`;
      muteButton.classList.toggle("background__red");
      muteButton.innerHTML = html;
    } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      html = `<i class="fas fa-microphone"></i>`;
      muteButton.classList.toggle("background__red");
      muteButton.innerHTML = html;
    }
  });
  //video mute/unmute options
  stopVideo.addEventListener("click", () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      html = `<i class="fas fa-video-slash"></i>`;
      stopVideo.classList.toggle("background__red");
      stopVideo.innerHTML = html;
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      html = `<i class="fas fa-video"></i>`;
      stopVideo.classList.toggle("background__red");
      stopVideo.innerHTML = html;
    }
  });
  //leave meeting
  const LeaveMeeting = () =>{
    if(confirm("Are you sure you want to leave the meeting?")){
      window.close()
    }
  }
  //invite link to join the call
  inviteButton.addEventListener("click", (e) => {
    prompt(
      "Copy this link and send it to people you want to meet with",
      window.location.href
    );
  });
  
  
