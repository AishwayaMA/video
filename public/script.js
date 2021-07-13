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

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  });

  peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
  });
  
const connectToNewUser = (userId, stream) =>
 {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  })

  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call

};
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
  
  showChat.addEventListener("click", () => {
    document.querySelector(".main__right").style.display = "flex";
    document.querySelector(".main__right").style.flex = "1";
    document.querySelector(".main__left").style.display = "none";
    document.querySelector(".header__back").style.display = "block";
  });
  const inviteButton = document.querySelector("#inviteButton");
  const muteButton = document.querySelector("#muteButton");
  const stopVideo = document.querySelector("#stopVideo");
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
  
  inviteButton.addEventListener("click", (e) => {
    prompt(
      "Copy this link and send it to people you want to meet with",
      window.location.href
    );
  });
  
  