(() => {
  //= include '_base.js'

  if (document.readyState === 'loading') {
    //Так как события LOCATION/PAGE_READY на обычном локолхосте нет, мы его эмулируем с помощью события load
    !window.location.href.includes('localhost')
      ? configOfEventListeners(false, {
          target: window,
          type: 'LOCATION/PAGE_READY',
          func: initJs,
        })
      : configOfEventListeners(false, {
          target: window,
          type: 'load',
          func: initJs,
        });
    //END
  } else {
    initJs();
  }

  function initJs() {
    // Тут начинается твой js-код
    let audio, playbtn, mutebtn, seekslider, volumeslider, seeking=false, seekto, curtimetext, durtimetext;

    function initAudioPlayer(){
      audio = new Audio('https://cdn.the-village.ru/the-village.ru/assets/sensai-1403/audio_1.mp3');
      playbtn = document.getElementById("playpausebtn");
      mutebtn = document.getElementById("mutebtn");
      seekslider = document.getElementById("seekslider");
      // Add Event Handling
      playbtn.addEventListener("click",playPause);
      mutebtn.addEventListener("click", mute);
      seekslider.addEventListener("mousedown", function(event){ seeking=true; seek(event); });
      seekslider.addEventListener("mousemove", function(event){ seek(event); });
      seekslider.addEventListener("mouseup",function(){ seeking=false; });
      audio.addEventListener("timeupdate", function(){ seektimeupdate(); });
      // Functions
      function playPause(){
        if(audio.paused){
          audio.play();
          playbtn.style.background = "url(https://cdn.the-village.ru/the-village.ru/2021/12/17/pausebtn_0.svg) center no-repeat";
          playbtn.style.backgroundSize = "100% 100%"
        } else {
          audio.pause();
          playbtn.style.background = "url(https://cdn.the-village.ru/the-village.ru/2021/12/17/playbtn_1.svg) center no-repeat";
          playbtn.style.backgroundSize = "100% 100%"
        }
      }
      function mute(){
        if(audio.muted){
          audio.muted = false;
          console.log("Вкл аудио");
          mutebtn.style.background = "url(https://cdn.the-village.ru/the-village.ru/2021/12/17/unmuted-btn.svg) center no-repeat";
          mutebtn.style.backgroundSize = "100% 100%";
        } else{
          audio.muted = true;
          console.log("Выкл аудио");
          mutebtn.style.background = "url(https://cdn.the-village.ru/the-village.ru/2021/12/17/sound-btn_0.svg) center no-repeat";
          mutebtn.style.backgroundSize = "100% 100%";
        }
      }
      function seek(event){
        if(seeking){
          seekslider.value = (event.clientX - seekslider.offsetLeft);
          seekto = audio.duration * (seekslider.value / 100);
          audio.currentTime = seekto;
        }
      }

      function seektimeupdate(){
        var nt = audio.currentTime * (100 / audio.duration);
        seekslider.value = nt;
      }
      console.log("audio.duration " + audio.duration);
      console.log("audio.duration " + audio.duration);

    }
    window.addEventListener("load", initAudioPlayer);
  }

  configOfEventListeners(false, {
    target: window,
    type: 'LOCATION/PATHNAME_CHANGED',
    func: destroyJs,
  });
  function destroyJs() {
    // Удаляем все ивенты
    configOfEventListeners(true, true);
  }
})();
