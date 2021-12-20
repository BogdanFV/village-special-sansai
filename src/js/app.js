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
      console.log(backgroundVideo.readyState);
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
      console.log(target, audio, audios);

      if (audio.paused) {
        audio.play();

        console.log('вкл аудио №' + target__index);

        /* Вот эту штуку лучше не инлайнить, тк картинка загружается ток в момент первого вызова кода,
           лучше унести это в before/after элменты css и просто накидывать какиой-то класс для изменения стейта и отображения другой пикчи
           ваще всегда старайся уносить всякие css штуки в css, так код и рендер быстрее будет работать
        */
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/pausebtn_0.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
        // END
      } else {
        audio.pause();

        console.log('выкл аудио №' + target__index);

        /* Вот эту штуку лучше не инлайнить, тк картинка загружается ток в момент первого вызова кода,
           лучше унести это в before/after элменты css и просто накидывать какиой-то класс для изменения стейта и отображения другой пикчи
           ваще всегда старайся уносить всякие css штуки в css, так код и рендер быстрее будет работать
        */
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/playbtn_1.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
        // END
      }
    }
    function mute(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-audio-index'); // У каждой кнопки мута в дата аттрибуте лежит индекс аудио за которое она отвечает

      let audio = audios[target__index];

      if (audio.volume == 1) {
        // Заменил muted на volume, тк в сафари возникают конфликты с мутед этим
        audio.volume = 0;

        console.log('Мут аудио №' + target__index);

        /* Вот эту штуку лучше не инлайнить, тк картинка загружается ток в момент первого вызова кода,
           лучше унести это в before/after элменты css и просто накидывать какиой-то класс для изменения стейта и отображения другой пикчи
           ваще всегда старайся уносить всякие css штуки в css, так код и рендер быстрее будет работать
        */
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/sound-btn_0.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
        // END
      } else {
        // Заменил muted на volume, тк в сафари возникают конфликты с мутед этим
        audio.volume = 1;

        console.log('Демут аудио №' + target__index);

        /* Вот эту штуку лучше не инлайнить, тк картинка загружается ток в момент первого вызова кода,
           лучше унести это в before/after элменты css и просто накидывать какиой-то класс для изменения стейта и отображения другой пикчи
           ваще всегда старайся уносить всякие css штуки в css, так код и рендер быстрее будет работать
        */
        target.style.background =
          'url(https://cdn.the-village.ru/the-village.ru/2021/12/17/unmuted-btn.svg) center no-repeat';
        target.style.backgroundSize = '100% 100%';
        // END
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
      // в этой функции мы трекаем изменение инпута
      let target = event.currentTarget,
        target__value = target.value, // Забираем значение выбранное в инпуте
        target__index = target.getAttribute('data-audio-index'); // У каждого инпутпа в дата аттрибуте лежит индекс аудио за которое он отвечает

      let audio = audios[target__index],
        audio__duration = audio.duration;

      let neededCurrentTime = audio__duration * (target__value / 100); // получаем время необходимое для прослушивания

      audio.currentTime = neededCurrentTime;
    }

    function seektimeupdate(event) {
      // в этой функции мы трекаем изменение currentTime у аудио
      let target = event.currentTarget,
        target__index = audios.indexOf(target);

      // Тут собираем инфу для изменения инпута по мере прослушивания
      let target__currentTime = target.currentTime,
        target__duration = target.duration;

      let neededValueForInput = (target__currentTime * 100) / target__duration;

      seeksliders[target__index].value = neededValueForInput;
      // END

      // Тут надо ебаться с настройкой отоюражения этих текстовых-блоков-субтитров
      showSubs(target__index);
      // END
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

      switch (indexOfAudio) {
        case 0:
          switch(true){
            case audio__currentTime >= 6 && audio__currentTime <= 16:
              currentIndexOfSub = 1;
              break;

            case audio__currentTime >= 19 && audio__currentTime <= 25:
              currentIndexOfSub = 2;
              break;

            case audio__currentTime >= 28 && audio__currentTime <= 34:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 37 && audio__currentTime <= 43:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 46 && audio__currentTime <= 49:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 51 && audio__currentTime <= 57:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 61 && audio__currentTime <= 68:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 74 && audio__currentTime <= 82:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 88 && audio__currentTime <= 97:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 103 && audio__currentTime <= 113:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 118 && audio__currentTime <= 125:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 130 && audio__currentTime <= 137:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 141 && audio__currentTime <= 151:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 157 && audio__currentTime <= 164:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 168 && audio__currentTime <= 179:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 182 && audio__currentTime <= 203:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 206 && audio__currentTime <= 217:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 219 && audio__currentTime <= 233:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 235 && audio__currentTime <= 246:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 249 && audio__currentTime <= 258:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 261 && audio__currentTime <= 263:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 265 && audio__currentTime <= 281:
              currentIndexOfSub = 22;
              break;


            case audio__currentTime == audio__duration :
              finishMeditation();
              console.log("we are here");
              break;

            default:
              console.log(audio__currentTime);
              console.log("0");
              currentIndexOfSub = 0;
              break;
          };
          break;
        case 1:
          switch(true){
            case audio__currentTime >= 5 && audio__currentTime <= 12:
              currentIndexOfSub = 1;
              break;

            case audio__currentTime >= 15 && audio__currentTime <= 36:
              currentIndexOfSub = 2;
              break;

            case audio__currentTime >= 38 && audio__currentTime <= 41:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 43 && audio__currentTime <= 47:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 51 && audio__currentTime <= 53:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 57 && audio__currentTime <= 60:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 65 && audio__currentTime <= 72:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 78 && audio__currentTime <= 81:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 86 && audio__currentTime <= 94:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 100 && audio__currentTime <= 107:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 111 && audio__currentTime <= 128:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 135 && audio__currentTime <= 140:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 144 && audio__currentTime <= 158:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 167 && audio__currentTime <= 170:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 173 && audio__currentTime <= 182:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 185 && audio__currentTime <= 204:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 210 && audio__currentTime <= 212:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 218 && audio__currentTime <= 220:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 223 && audio__currentTime <= 225:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 236 && audio__currentTime <= 249:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 252 && audio__currentTime <= 265:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 270 && audio__currentTime <= 280:
              currentIndexOfSub = 22;
              break;

            case audio__currentTime >= 288 && audio__currentTime <= 295:
              currentIndexOfSub = 23;
              break;

            case audio__currentTime >= 299 && audio__currentTime <= 309:
              currentIndexOfSub = 24;
              break;

            case audio__currentTime >= 311 && audio__currentTime <= 314:
              currentIndexOfSub = 25;
              break;
            case audio__currentTime >= 318 && audio__currentTime <= 322:
              currentIndexOfSub = 26;
              break;

            case audio__currentTime >= 325 && audio__currentTime <= 330:
              currentIndexOfSub = 27;
              break;

            case audio__currentTime >= 333 && audio__currentTime <= 342:
              currentIndexOfSub = 28;
              break;

            case audio__currentTime == audio__duration:
              finishMeditation();
              console.log("we are here");
              break;

            default:
              console.log(audio__currentTime);
              console.log("0");
              currentIndexOfSub = 0;
              break;
          };
          break;

        case 2:
            switch(true){
              case audio__currentTime >= 7 && audio__currentTime <= 14:
                currentIndexOfSub = 1;
                break;

              case audio__currentTime >= 17 && audio__currentTime <= 37:
                currentIndexOfSub = 2;
                break;

              case audio__currentTime >= 61 && audio__currentTime <= 70:
                currentIndexOfSub = 3;
                break;

              case audio__currentTime >= 73 && audio__currentTime <= 78:
                currentIndexOfSub = 4;
                break;

              case audio__currentTime >= 83 && audio__currentTime <= 89:
                currentIndexOfSub = 5;
                break;

              case audio__currentTime >= 93 && audio__currentTime <= 101:
                currentIndexOfSub = 6;
                break;

              case audio__currentTime >= 110 && audio__currentTime <= 112:
                currentIndexOfSub = 7;
                break;

              case audio__currentTime >= 116 && audio__currentTime <= 117:
                currentIndexOfSub = 8;
                break;

              case audio__currentTime >= 123 && audio__currentTime <= 124:
                currentIndexOfSub = 9;
                break;

              case audio__currentTime >= 128 && audio__currentTime <= 129:
                currentIndexOfSub = 10;
                break;

              case audio__currentTime >= 135 && audio__currentTime <= 138:
                currentIndexOfSub = 11;
                break;

              case audio__currentTime >= 144 && audio__currentTime <= 149:
                currentIndexOfSub = 12;
                break;

              case audio__currentTime >= 155 && audio__currentTime <= 157:
                currentIndexOfSub = 13;
                break;

              case audio__currentTime >= 161 && audio__currentTime <= 163:
                currentIndexOfSub = 14;
                break;

              case audio__currentTime >= 171 && audio__currentTime <= 175:
                currentIndexOfSub = 15;
                break;

              case audio__currentTime >= 179 && audio__currentTime <= 183:
                currentIndexOfSub = 16;
                break;

              case audio__currentTime >= 193 && audio__currentTime <= 201:
                currentIndexOfSub = 17;
                break;

              case audio__currentTime >= 203 && audio__currentTime <= 219:
                currentIndexOfSub = 18;
                break;

              case audio__currentTime >= 223 && audio__currentTime <= 230:
                currentIndexOfSub = 19;
                break;

              case audio__currentTime >= 233 && audio__currentTime <= 248:
                currentIndexOfSub = 20;
                break;

              case audio__currentTime >= 253 && audio__currentTime <= 258:
                currentIndexOfSub = 21;
                break;

              case audio__currentTime >= 261 && audio__currentTime <= 264:
                currentIndexOfSub = 22;
                break;

              case audio__currentTime >= 266 && audio__currentTime <= 271:
                currentIndexOfSub = 23;
                break;


              case audio__currentTime == audio__duration:
                finishMeditation();
                console.log("we are here");
                break;

              default:
                console.log(audio__currentTime);
                console.log("0");
                currentIndexOfSub = 0;
                break;
            };
            break;

        case 3:
          switch(true){
            case audio__currentTime >= 5 && audio__currentTime <= 23:
              currentIndexOfSub = 1;
              break;

            case audio__currentTime >= 26 && audio__currentTime <= 27:
              currentIndexOfSub = 2;
              break;

            case audio__currentTime >= 30 && audio__currentTime <= 32:
              currentIndexOfSub = 3;
              break;

            case audio__currentTime >= 35 && audio__currentTime <= 52:
              currentIndexOfSub = 4;
              break;

            case audio__currentTime >= 61 && audio__currentTime <= 70:
              currentIndexOfSub = 5;
              break;

            case audio__currentTime >= 79 && audio__currentTime <= 84:
              currentIndexOfSub = 6;
              break;

            case audio__currentTime >= 89 && audio__currentTime <= 99:
              currentIndexOfSub = 7;
              break;

            case audio__currentTime >= 106 && audio__currentTime <= 112:
              currentIndexOfSub = 8;
              break;

            case audio__currentTime >= 114 && audio__currentTime <= 121:
              currentIndexOfSub = 9;
              break;

            case audio__currentTime >= 123 && audio__currentTime <= 125:
              currentIndexOfSub = 10;
              break;

            case audio__currentTime >= 127 && audio__currentTime <= 130:
              currentIndexOfSub = 11;
              break;

            case audio__currentTime >= 131 && audio__currentTime <= 135:
              currentIndexOfSub = 12;
              break;

            case audio__currentTime >= 139 && audio__currentTime <= 145:
              currentIndexOfSub = 13;
              break;

            case audio__currentTime >= 148 && audio__currentTime <= 153:
              currentIndexOfSub = 14;
              break;

            case audio__currentTime >= 158 && audio__currentTime <= 160:
              currentIndexOfSub = 15;
              break;

            case audio__currentTime >= 165 && audio__currentTime <= 169:
              currentIndexOfSub = 16;
              break;

            case audio__currentTime >= 172 && audio__currentTime <= 174:
              currentIndexOfSub = 17;
              break;

            case audio__currentTime >= 178 && audio__currentTime <= 179:
              currentIndexOfSub = 18;
              break;

            case audio__currentTime >= 182 && audio__currentTime <= 187:
              currentIndexOfSub = 19;
              break;

            case audio__currentTime >= 190 && audio__currentTime <= 193:
              currentIndexOfSub = 20;
              break;

            case audio__currentTime >= 201 && audio__currentTime <= 205:
              currentIndexOfSub = 21;
              break;

            case audio__currentTime >= 209 && audio__currentTime <= 214:
              currentIndexOfSub = 22;
              break;

            case audio__currentTime >= 221 && audio__currentTime <= 228:
              currentIndexOfSub = 23;
              break;

            case audio__currentTime >= 231 && audio__currentTime <= 236:
              currentIndexOfSub = 24;
              break;

            case audio__currentTime >= 238 && audio__currentTime <= 240:
              currentIndexOfSub = 25;
              break;

            case audio__currentTime >= 242 && audio__currentTime <= 251:
              currentIndexOfSub = 26;
              break;

            case audio__currentTime >= 256 && audio__currentTime <= 261:
              currentIndexOfSub = 27;
              break;

            case audio__currentTime >= 264 && audio__currentTime <= 267:
              currentIndexOfSub = 28;
              break;

            case audio__currentTime >= 273 && audio__currentTime <= 277:
              currentIndexOfSub = 29;
              break;

            case audio__currentTime >= 282 && audio__currentTime <= 284:
              currentIndexOfSub = 30;
              break;

            case audio__currentTime >= 288 && audio__currentTime <= 297:
              currentIndexOfSub = 31;
              break;


            case audio__currentTime == audio__duration:
              finishMeditation();
              console.log("we are here");
              break;

            default:
              console.log(audio__currentTime);
              console.log("0");
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
