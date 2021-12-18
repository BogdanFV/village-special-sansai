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
      meditationsContainer = document.querySelector('.meditationsContainer');

    /* немного другие дал названия классам,
       тк надо повыситьь оригинальность этих элементов, чтобы не было кейсов с найдеными похожими эдементами на странице
    */
    let audios = [...postContainer.querySelectorAll('.post__audio')];

    let playbtns = [...postContainer.querySelectorAll('.post__playpausebtn')],
      mutebtns = [...postContainer.querySelectorAll('.post__mutebtn')];

    let seeksliders = [...postContainer.querySelectorAll('.post__seekslider')];
    // END

    // получаем карточки с главного меню
    let itemsToOpenLandingMeditation = [
        ...postContainer.querySelectorAll('.openLandingMeditation'),
      ],
      itemsToStartMeditation = [
        ...postContainer.querySelectorAll('.startMeditation'),
      ];

    // Add Event Handling
    itemsToOpenLandingMeditation.forEach((itemToOpenLandingMeditation) => {
      // playbtn.addEventListener("click", playPause);
      configOfEventListeners(false, {
        target: itemToOpenLandingMeditation,
        type: 'click',
        func: goToMeditationLanding,
      }); // вешаем ивентлистнер правильно
    });
    itemsToStartMeditation.forEach((itemToStartMeditation) => {
      // playbtn.addEventListener("click", playPause);
      configOfEventListeners(false, {
        target: itemToStartMeditation,
        type: 'click',
        func: startMeditation,
      }); // вешаем ивентлистнер правильно
    });
    // Тк кнопок/инпутов/аудио у тебя будет несколько, проходимся по массиву из них  и всем вешаем ивентлистнеры
    playbtns.forEach((playbtn) => {
      // playbtn.addEventListener("click", playPause);
      configOfEventListeners(false, {
        target: playbtn,
        type: 'click',
        func: playPause,
      }); // вешаем ивентлистнер правильно
    });
    mutebtns.forEach((mutebtn) => {
      // mutebtn.addEventListener("click", mute);
      configOfEventListeners(false, {
        target: mutebtn,
        type: 'click',
        func: mute,
      }); // вешаем ивентлистнер правильно
    });

    seeksliders.forEach((seekslider) => {
      // seekslider.addEventListener("input", seek);
      configOfEventListeners(false, {
        target: seekslider,
        type: 'input',
        func: seek,
      }); // вешаем ивентлистнер правильно
    });

    audios.forEach((audio) => {
      // audio.addEventListener("timeupdate", seektimeupdate);
      configOfEventListeners(false, {
        target: audio,
        type: 'timeupdate',
        func: seektimeupdate,
      }); // вешаем ивентлистнер правильно
    });
    // END

    // Functions
    // Контрлим переход к посадочной страницы медитации
    function goToMeditationLanding(event) {
      let target = event.currentTarget,
        target__index = target.getAttribute('data-meditation-index');

      menuContainer.classList.add('openMeditation');
      meditationsContainer.setAttribute('data-meditation', target__index);
    }
    // END
    // Контролим переход с самой странице медитации
    function startMeditation(event) {
      meditationsContainer.classList.add('startMeditation');
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

    function showSubs(indexOfAudio) {
      // В этой функции мы настраиваем отоюражение субтитров
      let audio = audios[indexOfAudio],
        audio__currentTime = audio.currentTime;

      switch (indexOfAudio) {
        case 0: //Если аудио №1, то контролим отображение субтитров
          if (audio__currentTime >= 0 && audio__currentTime <= 5) {
            // Если мы находимся на промежутке от 0 до 5 сек
            // отображаем где-то такой-то текст
          }
          break;
      }
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
