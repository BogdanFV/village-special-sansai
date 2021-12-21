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
    let postContainer = document.querySelector('.startContainer');

    let menuContainer = document.querySelector('.menuContainer'),
      meditationsContainer = document.querySelector('.meditationsContainer'),
      finalContainer = document.querySelector('.finalContainer');
    let audios = [...postContainer.querySelectorAll('.post__audio')];

    let playbtns = [...postContainer.querySelectorAll('.post__playpausebtn')],
      mutebtns = [...postContainer.querySelectorAll('.post__mutebtn')],
      backbtns = [...postContainer.querySelectorAll('.post__backbtn')];

    let seeksliders = [...postContainer.querySelectorAll('.post__seekslider')];
    let seeksliderCovers = [...postContainer.querySelectorAll('.post__seekslider__indicator')];
    let itemsToOpenLandingMeditation = [
        ...postContainer.querySelectorAll('.openLandingMeditation'),
      ],
      itemsToStartMeditation = [
        ...postContainer.querySelectorAll('.startMeditation'),
      ];
    let backgroundVideo = document.getElementById('background-video');
    let preloadText = document.querySelector('.preloader-percent');
    let preloaderBlock = document.querySelector('.preloader-indicator');



    backgroundVideo.onprogress = function() {
      switch(backgroundVideo.readyState){
        case 0:
          preloadText.innerHTML = "0%";
          break;
        case 1:
          preloadText.innerHTML = "25%";
          break;
        case 2:
          preloadText.innerHTML = "50%";
          break;
        case 3:
          preloadText.innerHTML = "75%";
          break;
        case 4:
          preloadText.innerHTML = "100%";
          preloaderBlock.classList.add("invicible-indicator");
          menuContainer.classList.remove('preloaded-for-meditations');
          break;
      }
    };

    backgroundVideo.onloadeddata = function(){
      preloadText.innerHTML = "100%";
      preloaderBlock.classList.add("invicible-indicator");
      menuContainer.classList.remove('preloaded-for-meditations');
    }

    itemsToOpenLandingMeditation.forEach((itemToOpenLandingMeditation) => {
      configOfEventListeners(false, {
        target: itemToOpenLandingMeditation,
        type: 'click',
        func: goToMeditationLanding,
      });
    });

    itemsToStartMeditation.forEach((itemToStartMeditation) => {
      configOfEventListeners(false, {
        target: itemToStartMeditation,
        type: 'click',
        func: startMeditation,
      });
    });

    playbtns.forEach((playbtn) => {
      // playbtn.addEventListener("click", playPause);
      configOfEventListeners(false, {
        target: playbtn,
        type: 'click',
        func: playPause,
      }); // вешаем ивентлистнер правильно
    });

    mutebtns.forEach((mutebtn) => {
      configOfEventListeners(false, {
        target: mutebtn,
        type: 'click',
        func: mute,
      });
    });

    backbtns.forEach((backbtn) => {
      configOfEventListeners(false, {
        target: backbtn,
        type: 'click',
        func: back,
      });
    });

    seeksliders.forEach((seekslider) => {
      configOfEventListeners(false, {
        target: seekslider,
        type: 'input',
        func: seek,
      });
    });

    audios.forEach((audio) => {
      configOfEventListeners(false, {
        target: audio,
        type: 'timeupdate',
        func: seektimeupdate,
      });
    });

    // Контрлим переход к посадочной странице медитации
    function goToMeditationLanding(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-meditation-index');

      menuContainer.classList.add('openMeditation');
      meditationsContainer.classList.remove('endMeditation');

      meditationsContainer.setAttribute('data-meditation', target__index);
    }
    // END
    // Контролим переход с самой странице медитации
    function startMeditation(event) {
      meditationsContainer.classList.add('startMeditation');
    }
    function finishMeditation(event){
      meditationsContainer.classList.add('endMeditation');
      meditationsContainer.classList.remove('startMeditation');
    }
    // END

    function playPause(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-audio-index'); // У каждой кнопки плея в дата аттрибуте лежит индекс аудио за которое она отвечает

      let audio = audios[target__index];
     // console.log(target, audio, audios);

      if (audio.paused) {
        audio.play();
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/pausebtn_0.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
        // END
      } else {
        audio.pause();
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/playbtn_1.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
      }
    }
    function mute(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-audio-index');

      let audio = audios[target__index];

      if (audio.volume == 1) {
        audio.volume = 0;
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/sound-btn_0.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
      } else {
        audio.volume = 1;
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/unmuted-btn.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
      }
    }
    function back(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-audio-index');
      let audio = audios[target__index];

      audio.pause();
      meditationsContainer.classList.remove('startMeditation');
      menuContainer.classList.remove('openMeditation');
    }
    function seek(event) {
      let target = event.currentTarget,
        target__value = target.value,
        target__index = target.getAttribute('data-audio-index');

      let audio = audios[target__index],
        audio__duration = audio.duration;
      let neededCurrentTime = audio__duration * (target__value / 100);

      audio.currentTime = neededCurrentTime;
      console.log("audio.currentTime: " + audio.currentTime);
      console.log("target__value: " + target__value);
    }

    function seektimeupdate(event) {
      let target = event.currentTarget,
        target__index = audios.indexOf(target);
      // Тут собираем инфу для изменения инпута по мере прослушивания
      let target__currentTime = target.currentTime,
        target__duration = target.duration;

      let neededValueForInput = (target__currentTime * 100) / target__duration;
      let sliderLength = document.querySelector('.post__seekslider__indicator');
      seeksliders[target__index].value = neededValueForInput;
      seeksliderCovers[target__index].style.width = seeksliders[target__index].value + "%";
      showSubs(target__index);
    }

    let meditationItems = [
      ...meditationsContainer.querySelectorAll(
        'meditationsContainer__meditation',
      ),
    ];

    function showSubs(indexOfAudio) {
      // В этой функции мы настраиваем отоюражение субтитров
      let audio = audios[indexOfAudio],
        audio__currentTime = audio.currentTime;
        audio__duration = audio.duration;

      let subsContainer = meditationsContainer.querySelector(
        `.meditationsContainer__meditation[data-index='${indexOfAudio}'] .player__texts[data-text]`,
      );
      let currentIndexOfSub = -1;
      let newTimeInterval;

      switch (indexOfAudio) {
        case 0:
          switch(true){
            case audio__currentTime >= 6 && audio__currentTime <= 1 + 16:
              currentIndexOfSub = 1;
              if(Math.trunc(audio__currentTime) == 14){
                subsContainer.children[currentIndexOfSub-1].classList.remove('music-player-text');
                subsContainer.children[currentIndexOfSub-1].classList.add('music-player-text-dissapear');
              }
              newTimeInterval = audio__currentTime;
              break;

            case audio__currentTime >= 19 && audio__currentTime <= 1 + 25:
              currentIndexOfSub = 2;

              break;

            case audio__currentTime >= 28 && audio__currentTime <= 1 + 34:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 37 && audio__currentTime <= 1 + 43:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 46 && audio__currentTime <= 1 + 49:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 51 && audio__currentTime <= 1 + 57:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 61 && audio__currentTime <= 1 + 68:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 74 && audio__currentTime <= 1 + 82:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 88 && audio__currentTime <= 1 + 97:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 103 && audio__currentTime <= 1 + 113:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 118 && audio__currentTime <= 1 + 125:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 130 && audio__currentTime <= 1 + 137:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 141 && audio__currentTime <= 1 + 151:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 157 && audio__currentTime <= 1 + 164:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 168 && audio__currentTime <= 1 + 179:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 182 && audio__currentTime <= 1 + 203:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 206 && audio__currentTime <= 1 + 217:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 219 && audio__currentTime <= 1 + 233:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 235 && audio__currentTime <= 1 + 246:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 249 && audio__currentTime <= 1 + 258:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 261 && audio__currentTime <= 1 + 263:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 265 && audio__currentTime <= 1 + 281:
              currentIndexOfSub = 22;
              break;


            case audio__currentTime == audio__duration :
              finishMeditation();
              break;

            default:
              //console.log(subsContainer.children[currentIndexOfSub-1]);
             // setTimeout("currentIndexOfSub = 0", 500);
              break;
          };
          break;
        case 1:
          switch(true){
            case audio__currentTime >= 5 && audio__currentTime <= 1 + 12:
              currentIndexOfSub = 1;
              break;

            case audio__currentTime >= 15 && audio__currentTime <= 1 + 36:
              currentIndexOfSub = 2;
              break;

            case audio__currentTime >= 38 && audio__currentTime <= 1 + 41:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 43 && audio__currentTime <= 1 + 47:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 51 && audio__currentTime <= 1 + 53:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 57 && audio__currentTime <= 1 + 60:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 65 && audio__currentTime <= 1 + 72:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 78 && audio__currentTime <= 1 + 81:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 86 && audio__currentTime <= 1 + 94:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 100 && audio__currentTime <= 1 + 107:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 111 && audio__currentTime <= 1 + 128:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 135 && audio__currentTime <= 1 + 140:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 144 && audio__currentTime <= 1 + 158:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 167 && audio__currentTime <= 1 + 170:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 173 && audio__currentTime <= 1 + 182:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 185 && audio__currentTime <= 1 + 204:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 210 && audio__currentTime <= 1 + 212:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 218 && audio__currentTime <= 1 + 220:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 223 && audio__currentTime <= 1 + 225:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 236 && audio__currentTime <= 1 + 249:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 252 && audio__currentTime <= 1 + 265:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 270 && audio__currentTime <= 1 + 280:
              currentIndexOfSub = 22;
              break;

            case audio__currentTime >= 288 && audio__currentTime <= 1 + 295:
              currentIndexOfSub = 23;
              break;

            case audio__currentTime >= 299 && audio__currentTime <= 1 + 309:
              currentIndexOfSub = 24;
              break;

            case audio__currentTime >= 311 && audio__currentTime <= 1 + 314:
              currentIndexOfSub = 25;
              break;
            case audio__currentTime >= 318 && audio__currentTime <= 1 + 322:
              currentIndexOfSub = 26;
              break;

            case audio__currentTime >= 325 && audio__currentTime <= 1 + 330:
              currentIndexOfSub = 27;
              break;

            case audio__currentTime >= 333 && audio__currentTime <= 1 + 342:
              currentIndexOfSub = 28;
              break;

            case audio__currentTime == audio__duration:
              finishMeditation();
              break;

            default:
              console.log(audio__currentTime);
              currentIndexOfSub = 0;
              break;
          };
          break;

        case 2:
            switch(true){
              case audio__currentTime >= 7 && audio__currentTime <= 1 + 14:
                currentIndexOfSub = 1;
                break;

              case audio__currentTime >= 17 && audio__currentTime <= 1 + 37:
                currentIndexOfSub = 2;
                break;

              case audio__currentTime >= 61 && audio__currentTime <= 1 + 70:
                currentIndexOfSub = 3;
                break;

              case audio__currentTime >= 73 && audio__currentTime <= 1 + 78:
                currentIndexOfSub = 4;
                break;

              case audio__currentTime >= 83 && audio__currentTime <= 1 + 89:
                currentIndexOfSub = 5;
                break;

              case audio__currentTime >= 93 && audio__currentTime <= 1 + 101:
                currentIndexOfSub = 6;
                break;

              case audio__currentTime >= 110 && audio__currentTime <= 1 + 112:
                currentIndexOfSub = 7;
                break;

              case audio__currentTime >= 116 && audio__currentTime <= 1 + 117:
                currentIndexOfSub = 8;
                break;

              case audio__currentTime >= 123 && audio__currentTime <= 1 + 124:
                currentIndexOfSub = 9;
                break;

              case audio__currentTime >= 128 && audio__currentTime <= 1 + 129:
                currentIndexOfSub = 10;
                break;

              case audio__currentTime >= 135 && audio__currentTime <= 1 + 138:
                currentIndexOfSub = 11;
                break;

              case audio__currentTime >= 144 && audio__currentTime <= 1 + 149:
                currentIndexOfSub = 12;
                break;

              case audio__currentTime >= 155 && audio__currentTime <= 1 + 157:
                currentIndexOfSub = 13;
                break;

              case audio__currentTime >= 161 && audio__currentTime <= 1 + 163:
                currentIndexOfSub = 14;
                break;

              case audio__currentTime >= 171 && audio__currentTime <= 1 + 175:
                currentIndexOfSub = 15;
                break;

              case audio__currentTime >= 179 && audio__currentTime <= 1 + 183:
                currentIndexOfSub = 16;
                break;

              case audio__currentTime >= 193 && audio__currentTime <= 1 + 201:
                currentIndexOfSub = 17;
                break;

              case audio__currentTime >= 203 && audio__currentTime <= 1 + 219:
                currentIndexOfSub = 18;
                break;

              case audio__currentTime >= 223 && audio__currentTime <= 1 + 230:
                currentIndexOfSub = 19;
                break;

              case audio__currentTime >= 233 && audio__currentTime <= 1 + 248:
                currentIndexOfSub = 20;
                break;

              case audio__currentTime >= 253 && audio__currentTime <= 1 + 258:
                currentIndexOfSub = 21;
                break;

              case audio__currentTime >= 261 && audio__currentTime <= 1 + 264:
                currentIndexOfSub = 22;
                break;

              case audio__currentTime >= 266 && audio__currentTime <= 1 + 271:
                currentIndexOfSub = 23;
                break;


              case audio__currentTime == audio__duration:
                finishMeditation();

              default:
                console.log(audio__currentTime);
                currentIndexOfSub = 0;
                break;
            };
            break;

        case 3:
          switch(true){
            case audio__currentTime >= 5 && audio__currentTime <= 1 + 23:
              currentIndexOfSub = 1;
              break;

            case audio__currentTime >= 26 && audio__currentTime <= 1 + 27:
              currentIndexOfSub = 2;
              break;

            case audio__currentTime >= 30 && audio__currentTime <= 1 + 32:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 35 && audio__currentTime <= 1 + 52:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 61 && audio__currentTime <= 1 + 70:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 79 && audio__currentTime <= 1 + 84:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 89 && audio__currentTime <= 1 + 99:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 106 && audio__currentTime <= 1 + 112:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 114 && audio__currentTime <= 1 + 121:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 123 && audio__currentTime <= 1 + 125:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 127 && audio__currentTime <= 1 + 130:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 131 && audio__currentTime <= 1 + 135:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 139 && audio__currentTime <= 1 + 145:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 148 && audio__currentTime <= 1 + 153:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 158 && audio__currentTime <= 1 + 160:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 165 && audio__currentTime <= 1 + 169:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 172 && audio__currentTime <= 1 + 174:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 178 && audio__currentTime <= 1 + 179:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 182 && audio__currentTime <= 1 + 187:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 190 && audio__currentTime <= 1 + 193:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 201 && audio__currentTime <= 1 + 205:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 209 && audio__currentTime <= 1 + 214:
              currentIndexOfSub = 22;
              break;

            case audio__currentTime >= 221 && audio__currentTime <= 1 + 228:
              currentIndexOfSub = 23;
              break;

            case audio__currentTime >= 231 && audio__currentTime <= 1 + 236:
              currentIndexOfSub = 24;
              break;

            case audio__currentTime >= 238 && audio__currentTime <= 1 + 240:
              currentIndexOfSub = 25;
              break;

            case audio__currentTime >= 242 && audio__currentTime <= 1 + 251:
              currentIndexOfSub = 26;
              break;

            case audio__currentTime >= 256 && audio__currentTime <= 1 + 261:
              currentIndexOfSub = 27;
              break;

            case audio__currentTime >= 264 && audio__currentTime <= 1 + 267:
              currentIndexOfSub = 28;
              break;

            case audio__currentTime >= 273 && audio__currentTime <= 1 + 277:
              currentIndexOfSub = 29;
              break;

            case audio__currentTime >= 282 && audio__currentTime <= 1 + 284:
              currentIndexOfSub = 30;
              break;

            case audio__currentTime >= 288 && audio__currentTime <= 1 + 297:
              currentIndexOfSub = 31;
              break;


            case audio__currentTime == audio__duration:
              finishMeditation();
              break;

            default:
              console.log(audio__currentTime);
              currentIndexOfSub = 0;
              break;
          };
          break;
      }

      subsContainer.setAttribute('data-text', currentIndexOfSub);
    }
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
