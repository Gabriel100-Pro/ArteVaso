document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =====================================================
       CARROSSEL DE PRODUTOS
    ====================================================== */

    const productTrack =
      document.querySelector(
        ".products-track"
      );

    const productWrapper =
      document.querySelector(
        ".products-track-wrapper"
      );

    const prevButton =
      document.querySelector(
        ".carousel-prev"
      );

    const nextButton =
      document.querySelector(
        ".carousel-next"
      );

    const dots =
      document.querySelectorAll(
        ".carousel-dot"
      );

    const productCards =
      document.querySelectorAll(
        ".product-card"
      );


    let currentSlide = 0;

    let autoPlay = null;

    let startX = 0;

    let currentX = 0;

    let isDragging = false;



    /* =====================================================
       QUANTIDADE DE CARDS
    ====================================================== */

    function getVisibleCards() {

      const width =
        window.innerWidth;


      if (width <= 380) {
        return 1;
      }


      if (width <= 600) {
        return 2;
      }


      if (width <= 900) {
        return 3;
      }


      return 4;

    }



    /* =====================================================
       TOTAL DE SLIDES
    ====================================================== */

    function getTotalSlides() {

      if (!productCards.length) {
        return 1;
      }


      return Math.max(
        1,
        productCards.length -
        getVisibleCards() +
        1
      );

    }



    /* =====================================================
       ATUALIZAR CARROSSEL
    ====================================================== */

    function updateCarousel() {

      if (
        !productTrack ||
        !productCards.length
      ) {
        return;
      }


      const cardWidth =
        productCards[0].offsetWidth;


      const gap =
        parseFloat(
          getComputedStyle(
            productTrack
          ).gap
        ) || 0;


      const offset =
        currentSlide *
        (
          cardWidth +
          gap
        );


      productTrack.style.transform =
        `translateX(-${offset}px)`;


      dots.forEach(
        (
          dot,
          index
        ) => {

          dot.classList.toggle(
            "active",
            index === currentSlide
          );

        }
      );

    }



    /* =====================================================
       PRÓXIMO
    ====================================================== */

    function nextSlide() {

      const total =
        getTotalSlides();


      currentSlide++;

      if (
        currentSlide >= total
      ) {
        currentSlide = 0;
      }


      updateCarousel();

    }



    /* =====================================================
       ANTERIOR
    ====================================================== */

    function previousSlide() {

      const total =
        getTotalSlides();


      currentSlide--;


      if (
        currentSlide < 0
      ) {
        currentSlide =
          total - 1;
      }


      updateCarousel();

    }



    /* =====================================================
       AUTOPLAY
    ====================================================== */

    function startAutoPlay() {

      clearInterval(
        autoPlay
      );


      autoPlay =
        setInterval(
          nextSlide,
          5000
        );

    }


    function stopAutoPlay() {

      clearInterval(
        autoPlay
      );

      autoPlay = null;

    }



    /* =====================================================
       BOTÕES
    ====================================================== */

    if (nextButton) {

      nextButton.addEventListener(
        "click",
        () => {

          nextSlide();

          startAutoPlay();

        }
      );

    }


    if (prevButton) {

      prevButton.addEventListener(
        "click",
        () => {

          previousSlide();

          startAutoPlay();

        }
      );

    }



    /* =====================================================
       DOTS
    ====================================================== */

    dots.forEach(
      (
        dot,
        index
      ) => {

        dot.addEventListener(
          "click",
          () => {

            currentSlide =
              Math.min(
                index,
                getTotalSlides() - 1
              );

            updateCarousel();

            startAutoPlay();

          }
        );

      }
    );



    /* =====================================================
       DRAG DESKTOP
    ====================================================== */

    if (productTrack) {

      productTrack.addEventListener(
        "mousedown",
        (event) => {

          isDragging = true;

          startX =
            event.clientX;

          currentX =
            event.clientX;

          productTrack.classList.add(
            "dragging"
          );

          stopAutoPlay();

        }
      );


      window.addEventListener(
        "mousemove",
        (event) => {

          if (!isDragging) {
            return;
          }

          currentX =
            event.clientX;

        }
      );


      window.addEventListener(
        "mouseup",
        () => {

          if (!isDragging) {
            return;
          }

          isDragging = false;

          productTrack.classList.remove(
            "dragging"
          );


          const difference =
            currentX -
            startX;


          if (
            Math.abs(
              difference
            ) > 50
          ) {

            if (
              difference < 0
            ) {

              nextSlide();

            } else {

              previousSlide();

            }

          }


          startAutoPlay();

        }
      );



      /* =================================================
         TOUCH MOBILE
      ================================================== */

      productTrack.addEventListener(
        "touchstart",
        (event) => {

          startX =
            event.touches[0]
              .clientX;

        },
        {
          passive: true
        }
      );


      productTrack.addEventListener(
        "touchend",
        (event) => {

          currentX =
            event.changedTouches[0]
              .clientX;


          const difference =
            currentX -
            startX;


          if (
            Math.abs(
              difference
            ) > 50
          ) {

            if (
              difference < 0
            ) {

              nextSlide();

            } else {

              previousSlide();

            }

          }


          startAutoPlay();

        },
        {
          passive: true
        }
      );


      if (productWrapper) {

        productWrapper.addEventListener(
          "mouseenter",
          stopAutoPlay
        );


        productWrapper.addEventListener(
          "mouseleave",
          startAutoPlay
        );

      }

    }



    /* =====================================================
       INICIALIZAR PRODUTOS
    ====================================================== */

    updateCarousel();

    startAutoPlay();



    /* =====================================================
       NOVA SEÇÃO
       CONTADORES
    ====================================================== */

    const universeSection =
      document.querySelector(
        ".universe-section"
      );


    const counters =
      document.querySelectorAll(
        ".stat-number"
      );


    let countersStarted = false;



    /* =====================================================
       ANIMAÇÃO DOS NÚMEROS
    ====================================================== */

    function animateCounter(
      element
    ) {

      const target =
        Number(
          element.dataset.target
        );


      const prefix =
        element.dataset.prefix ||
        "";


      const suffix =
        element.dataset.suffix ||
        "";


      const duration =
        2200;


      const startTime =
        performance.now();


      function update(
        currentTime
      ) {

        const elapsed =
          currentTime -
          startTime;


        const progress =
          Math.min(
            elapsed /
            duration,
            1
          );


        /*
          Easing suave.
        */

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );


        const value =
          Math.floor(
            eased *
            target
          );


        element.textContent =
          prefix +
          value +
          suffix;


        if (
          progress < 1
        ) {

          requestAnimationFrame(
            update
          );

        } else {

          element.textContent =
            prefix +
            target +
            suffix;

        }

      }


      requestAnimationFrame(
        update
      );

    }



    /* =====================================================
       OBSERVER DOS NÚMEROS
    ====================================================== */

    if (
      universeSection &&
      counters.length
    ) {

      const counterObserver =
        new IntersectionObserver(
          (
            entries,
            observer
          ) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting &&
                  !countersStarted
                ) {

                  countersStarted =
                    true;


                  counters.forEach(
                    animateCounter
                  );


                  observer.disconnect();

                }

              }
            );

          },
          {
            threshold: 0.35
          }
        );


      counterObserver.observe(
        universeSection
      );

    }



    /* =====================================================
       CARDS INFERIORES
       LOOP INFINITO
    ====================================================== */

    const cardsTrack =
      document.querySelector(
        "#universeCardsTrack"
      );


    if (cardsTrack) {

      let position = 0;

      let speed = 0.55;

      let paused = false;

      let originalWidth = 0;


      /*
        Como temos os mesmos
        3 cards duplicados,
        usamos metade da largura
        para criar o loop infinito.
      */

      function calculateWidth() {

        originalWidth =
          cardsTrack.scrollWidth /
          2;

      }


      calculateWidth();


      /* =================================================
         LOOP DOS CARDS
      ================================================== */

      function animateCards() {

        if (!paused) {

          position -= speed;


          if (
            Math.abs(position) >=
            originalWidth
          ) {

            position = 0;

          }


          cardsTrack.style.transform =
            `translate3d(${position}px, 0, 0)`;

        }


        requestAnimationFrame(
          animateCards
        );

      }


      animateCards();



      /* =================================================
         PAUSAR AO PASSAR MOUSE
      ================================================== */

      const cardsWindow =
        document.querySelector(
          ".universe-cards-window"
        );


      if (cardsWindow) {

        cardsWindow.addEventListener(
          "mouseenter",
          () => {

            paused = true;

          }
        );


        cardsWindow.addEventListener(
          "mouseleave",
          () => {

            paused = false;

          }
        );

      }



      /* =================================================
         TOUCH MOBILE
      ================================================== */

      if (cardsWindow) {

        cardsWindow.addEventListener(
          "touchstart",
          () => {

            paused = true;

          },
          {
            passive: true
          }
        );


        cardsWindow.addEventListener(
          "touchend",
          () => {

            setTimeout(
              () => {

                paused = false;

              },
              700
            );

          },
          {
            passive: true
          }
        );

      }



      /* =================================================
         RESIZE
      ================================================== */

      window.addEventListener(
        "resize",
        () => {

          calculateWidth();

        }
      );

    }



    /* =====================================================
       SCROLL INDICATOR
    ====================================================== */

    const heroScroll =
      document.querySelector(
        "#heroScroll"
      );


    if (heroScroll) {

      window.addEventListener(
        "scroll",
        () => {

          if (
            window.scrollY > 100
          ) {

            heroScroll.style.opacity =
              "0";

          } else {

            heroScroll.style.opacity =
              "1";

          }

        },
        {
          passive: true
        }
      );

    }



    /* =====================================================
       SMOOTH SCROLL
    ====================================================== */

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(
        (anchor) => {

          anchor.addEventListener(
            "click",
            (event) => {

              const targetId =
                anchor.getAttribute(
                  "href"
                );


              if (
                !targetId ||
                targetId === "#"
              ) {
                return;
              }


              const target =
                document.querySelector(
                  targetId
                );


              if (!target) {
                return;
              }


              event.preventDefault();


              window.scrollTo({

                top:
                  target.getBoundingClientRect()
                    .top +
                  window.scrollY,

                behavior:
                  "smooth"

              });

            }
          );

        }
      );



    /* =====================================================
       REVEAL AO ENTRAR NA VIEWPORT
       (CUIDADOS / CONTATO)
    ====================================================== */

    const revealElements =
      document.querySelectorAll(
        "[data-reveal]"
      );


    if (revealElements.length) {

      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach(
              (entry) => {

                if (entry.isIntersecting) {

                  entry.target.classList.add(
                    "is-visible"
                  );


                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.2
          }
        );


      revealElements.forEach(
        (element) => {

          revealObserver.observe(
            element
          );

        }
      );

    }


    /* =====================================================
       TERRÁRIO PRINCIPAL
       ANIMAÇÃO DE SCROLL (HERO → EXPERIÊNCIA)

       O terrário é um elemento fixo. A cada frame
       calculamos, a partir do scroll real, onde ele
       deve estar entre a posição inicial (palco da
       hero) e a posição final (espaço central entre
       os quatro vasos do fundo da segunda seção).
    ====================================================== */

    const terrariumFloat =
      document.querySelector(
        "#terrariumFloat"
      );

    const terrariumImage =
      document.querySelector(
        "#terrariumImage"
      );

    const terrariumShadow =
      document.querySelector(
        "#terrariumShadow"
      );

    const heroStage =
      document.querySelector(
        "#heroStage"
      );

    const universeStage =
      document.querySelector(
        "#universeStage"
      );

    const universeBackground =
      document.querySelector(
        ".universe-background"
      );


    if (
      terrariumFloat &&
      terrariumImage &&
      terrariumShadow &&
      heroStage &&
      universeStage &&
      universeBackground &&
      universeSection
    ) {

      /* =================================================
         CONSTANTES DAS IMAGENS
      ================================================== */

      /*
        As duas imagens (terrário e fundo)
        têm 1536 x 1024 px.
      */

      const IMAGE_RATIO = 1536 / 1024;


      /*
        Área ocupada pelo vidro dentro do
        PNG transparente (fração da imagem).
        Usada para centralizar o vidro, e não
        a caixa da imagem.
      */

      const BOWL = {
        left:   261 / 1536,
        right:  1274 / 1536,
        top:    67 / 1024,
        bottom: 1008 / 1024
      };

      const BOWL_W =
        BOWL.right - BOWL.left;

      const BOWL_H =
        BOWL.bottom - BOWL.top;

      const BOWL_CX =
        (BOWL.left + BOWL.right) / 2;

      const BOWL_CY =
        (BOWL.top + BOWL.bottom) / 2;


      /*
        Ponto central entre os quatro vasos
        do fundo (fração da imagem de fundo).
      */

      const FOCUS = {
        x: 0.733,
        y: 0.464
      };


      /*
        Largura do vidro ao pousar, em fração
        da largura renderizada do fundo
        (desktop / modo palco).
      */

      const LANDING_BOWL_RATIO = 0.26;

      const LANDING_BOWL_RATIO_STAGE = 0.235;


      /*
        Rotação máxima no meio da viagem.
      */

      const MAX_TILT = 9;   /* rotate (Z)  */

      const MAX_TURN = 22;  /* rotateY     */


      const stageQuery =
        window.matchMedia(
          "(max-width: 900px)"
        );

      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );



      /* =================================================
         ESTADO
      ================================================== */

      const state = {

        start: {
          cx: 0,
          cy: 0,
          width: 0
        },

        end: {
          cx: 0,
          cy: 0,
          width: 0
        },

        scrollStart: 0,

        scrollEnd: 1,

        baseWidth: 760,

        baseHeight: 760 / IMAGE_RATIO,

        shadowBaseW: 760,

        shadowBaseH: 120,

        progress: 0,

        lastTime: 0,

        rafId: null,

        ready: false

      };



      /* =================================================
         UTILITÁRIOS
      ================================================== */

      function clamp(
        value,
        min,
        max
      ) {

        return Math.min(
          max,
          Math.max(
            min,
            value
          )
        );

      }


      function lerp(
        a,
        b,
        t
      ) {

        return a + (b - a) * t;

      }


      function easeInOutCubic(t) {

        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

      }


      function parseBackgroundPosition(
        value
      ) {

        const parts =
          String(value)
            .match(/-?[\d.]+%/g) || [];


        const x =
          parts[0]
            ? parseFloat(parts[0]) / 100
            : 0.5;

        const y =
          parts[1]
            ? parseFloat(parts[1]) / 100
            : 0.5;


        return { x, y };

      }



      /* =================================================
         MEDIÇÃO
         (posição inicial, posição final
         e intervalo de scroll)
      ================================================== */

      function measure() {

        const viewportW =
          window.innerWidth;

        const viewportH =
          window.innerHeight;

        const scrollY =
          window.scrollY;



        /* ---------- HERO: POSIÇÃO INICIAL ---------- */

        const heroRect =
          heroStage.getBoundingClientRect();


        const isMobile =
          viewportW <= 600;


        /*
          Limite de largura da imagem na hero:
          no tablet o vidro não deve encostar
          nas bordas da tela.
        */

        const maxStartWidth =
          isMobile
            ? viewportW - 28
            : Math.min(
                1040,
                (viewportW * 0.72) / BOWL_W
              );


        /*
          O vidro precisa caber no palco
          da hero, em largura e altura.
        */

        const startWidth =
          Math.max(
            180,
            Math.min(
              heroRect.width / BOWL_W,
              (heroRect.height / BOWL_H) * IMAGE_RATIO,
              maxStartWidth
            )
          );


        state.start.cx =
          heroRect.left +
          heroRect.width / 2;

        state.start.cy =
          heroRect.top +
          scrollY +
          heroRect.height / 2;

        state.start.width =
          startWidth;



        /* ---------- SEGUNDA SEÇÃO: POSIÇÃO FINAL ---------- */

        const sectionRect =
          universeSection.getBoundingClientRect();

        const sectionW =
          sectionRect.width;

        const sectionH =
          sectionRect.height;


        /*
          "box" = retângulo da imagem de fundo
          renderizada, relativo à seção.
        */

        let box;


        if (stageQuery.matches) {

          /*
            MOBILE / TABLET
            A imagem é dimensionada pela altura
            do palco superior e deslocada para
            que o espaço entre os vasos fique
            centralizado horizontalmente.
          */

          const stageH =
            universeStage.getBoundingClientRect()
              .height || 480;


          let renderH = stageH;

          let renderW =
            renderH * IMAGE_RATIO;


          if (renderW < sectionW) {

            renderW = sectionW;

            renderH =
              renderW / IMAGE_RATIO;

          }


          let offsetX =
            sectionW / 2 -
            FOCUS.x * renderW;


          offsetX =
            clamp(
              offsetX,
              sectionW - renderW,
              0
            );


          box = {
            x: offsetX,
            y: 0,
            w: renderW,
            h: renderH
          };


          universeSection.classList.add(
            "is-stage-mode"
          );

          universeBackground.style.backgroundSize =
            `${renderW}px ${renderH}px`;

          universeBackground.style.backgroundPosition =
            `${offsetX}px 0px`;

          universeBackground.style.setProperty(
            "--universe-bg-h",
            `${renderH}px`
          );

        } else {

          /*
            DESKTOP
            Mesma matemática do
            background-size: cover.
          */

          universeSection.classList.remove(
            "is-stage-mode"
          );

          universeBackground.style.backgroundSize = "";

          universeBackground.style.backgroundPosition = "";

          universeBackground.style.removeProperty(
            "--universe-bg-h"
          );


          const scale =
            Math.max(
              sectionW / 1536,
              sectionH / 1024
            );

          const renderW =
            1536 * scale;

          const renderH =
            1024 * scale;


          const position =
            parseBackgroundPosition(
              getComputedStyle(
                universeBackground
              ).backgroundPosition
            );


          box = {
            x: (sectionW - renderW) * position.x,
            y: (sectionH - renderH) * position.y,
            w: renderW,
            h: renderH
          };

        }


        const landingBowlW =
          clamp(
            box.w *
            (
              stageQuery.matches
                ? LANDING_BOWL_RATIO_STAGE
                : LANDING_BOWL_RATIO
            ),
            170,
            520
          );


        state.end.width =
          landingBowlW / BOWL_W;

        state.end.cx =
          sectionRect.left +
          box.x +
          FOCUS.x * box.w;

        state.end.cy =
          sectionRect.top +
          scrollY +
          box.y +
          FOCUS.y * box.h;



        /* ---------- INTERVALO DE SCROLL ---------- */

        /*
          A viagem começa no topo da página e
          termina quando o ponto de pouso está
          no centro da tela.
        */

        state.scrollStart = 0;

        state.scrollEnd =
          Math.max(
            state.end.cy - viewportH * 0.5,
            viewportH * 0.6
          );



        /* ---------- TAMANHO BASE DA IMAGEM ---------- */

        /*
          A imagem recebe a maior largura
          necessária; o tamanho real durante
          a animação é feito com scale().
        */

        const baseWidth =
          Math.ceil(
            Math.max(
              state.start.width,
              state.end.width
            )
          );


        if (baseWidth !== state.baseWidth) {

          state.baseWidth =
            baseWidth;

          state.baseHeight =
            baseWidth / IMAGE_RATIO;

          state.shadowBaseW =
            baseWidth;

          state.shadowBaseH =
            Math.round(baseWidth * 0.16);


          terrariumImage.style.width =
            `${baseWidth}px`;

          terrariumShadow.style.width =
            `${state.shadowBaseW}px`;

          terrariumShadow.style.height =
            `${state.shadowBaseH}px`;

        }

      }



      /* =================================================
         PROGRESSO ALVO A PARTIR DO SCROLL REAL
      ================================================== */

      function targetProgress() {

        const range =
          state.scrollEnd -
          state.scrollStart;


        if (range <= 0) {
          return 1;
        }


        return clamp(
          (window.scrollY - state.scrollStart) / range,
          0,
          1
        );

      }



      /* =================================================
         RENDER
      ================================================== */

      function render(progress) {

        const viewportH =
          window.innerHeight;

        const scrollY =
          window.scrollY;


        const eased =
          easeInOutCubic(progress);


        /*
          Arco: 0 → 1 → 0 ao longo da viagem.
          Usado para o "voo" e a rotação.
        */

        const arc =
          Math.sin(progress * Math.PI);


        const motion =
          reducedMotion.matches ? 0 : 1;



        /* ---------- TAMANHO E POSIÇÃO ---------- */

        const width =
          lerp(
            state.start.width,
            state.end.width,
            eased
          );

        const height =
          width / IMAGE_RATIO;


        const docX =
          lerp(
            state.start.cx,
            state.end.cx,
            eased
          );

        const docY =
          lerp(
            state.start.cy,
            state.end.cy,
            eased
          );


        /*
          Leve subida no meio da viagem,
          como se o terrário fosse carregado.
        */

        const lift =
          -arc * viewportH * 0.05 * motion;


        const bowlX =
          docX;

        const bowlY =
          docY - scrollY + lift;



        /* ---------- ROTAÇÃO ---------- */

        const tilt =
          -arc * MAX_TILT * motion;

        const turn =
          arc * MAX_TURN * motion;



        /* ---------- TRANSFORM DA IMAGEM ---------- */

        const scale =
          width / state.baseWidth;


        /*
          O centro do vidro não coincide
          exatamente com o centro da imagem.
        */

        const bowlOffsetX =
          (BOWL_CX - 0.5) * width;

        const bowlOffsetY =
          (BOWL_CY - 0.5) * height;


        const translateX =
          bowlX -
          bowlOffsetX -
          state.baseWidth / 2;

        const translateY =
          bowlY -
          bowlOffsetY -
          state.baseHeight / 2;


        terrariumImage.style.transform =
          `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) ` +
          `perspective(1400px) ` +
          `rotateY(${turn.toFixed(2)}deg) ` +
          `rotate(${tilt.toFixed(2)}deg) ` +
          `scale(${scale.toFixed(4)})`;



        /* ---------- SOMBRA (SÓ NA MESA DA HERO) ---------- */

        const shadowW =
          width * BOWL_W * 0.92;

        const shadowH =
          shadowW * 0.16;


        const shadowCX =
          bowlX;

        const shadowCY =
          bowlY +
          (height * BOWL_H) / 2 -
          shadowH * 0.12;


        const shadowScaleX =
          shadowW / state.shadowBaseW;

        const shadowScaleY =
          shadowH / state.shadowBaseH;


        terrariumShadow.style.transform =
          `translate3d(${(shadowCX - state.shadowBaseW / 2).toFixed(2)}px, ` +
          `${(shadowCY - state.shadowBaseH / 2).toFixed(2)}px, 0) ` +
          `scale(${shadowScaleX.toFixed(4)}, ${shadowScaleY.toFixed(4)})`;


        /*
          A sombra some logo no início da
          viagem: no ar, não há mesa.
        */

        const shadowFade =
          1 - clamp(progress * 2.4, 0, 1);


        terrariumShadow.style.opacity =
          (
            Math.pow(shadowFade, 2) * 0.9
          ).toFixed(3);



        /* ---------- FORA DA TELA ---------- */

        const halfH =
          height * 0.6;


        const offscreen =
          bowlY + halfH < -40 ||
          bowlY - halfH > viewportH + 40;


        terrariumFloat.classList.toggle(
          "is-offscreen",
          offscreen
        );

      }



      /* =================================================
         LOOP (requestAnimationFrame)
      ================================================== */

      function frame(time) {

        state.rafId = null;


        const target =
          targetProgress();


        /*
          Suavização leve e independente
          do frame rate: o terrário segue
          o scroll real, mas sem trancos.
        */

        const delta =
          state.lastTime
            ? Math.min(time - state.lastTime, 64)
            : 16.7;

        state.lastTime = time;


        const smoothing =
          1 - Math.pow(0.82, delta / 16.7);


        const difference =
          target - state.progress;


        if (
          Math.abs(difference) < 0.0008 ||
          reducedMotion.matches
        ) {

          state.progress = target;

        } else {

          state.progress +=
            difference * smoothing;

        }


        render(state.progress);


        if (state.progress !== target) {

          state.rafId =
            requestAnimationFrame(frame);

        } else {

          state.lastTime = 0;

        }

      }


      function requestFrame() {

        if (state.rafId === null) {

          state.rafId =
            requestAnimationFrame(frame);

        }

      }



      /* =================================================
         REMEDIR
      ================================================== */

      let measureTimer = null;


      function remeasure() {

        measure();

        requestFrame();

      }


      function scheduleRemeasure() {

        clearTimeout(measureTimer);

        measureTimer =
          setTimeout(
            remeasure,
            80
          );

      }



      /* =================================================
         INICIALIZAÇÃO
      ================================================== */

      function init() {

        if (state.ready) {
          return;
        }

        state.ready = true;


        measure();


        /*
          Primeiro frame sem suavização
          (ex.: página recarregada no meio).
        */

        state.progress =
          targetProgress();

        render(state.progress);


        terrariumFloat.classList.add(
          "is-ready"
        );

      }


      if (terrariumImage.complete) {

        init();

      } else {

        terrariumImage.addEventListener(
          "load",
          init
        );

        terrariumImage.addEventListener(
          "error",
          init
        );

      }



      /* =================================================
         EVENTOS
      ================================================== */

      window.addEventListener(
        "scroll",
        requestFrame,
        {
          passive: true
        }
      );


      window.addEventListener(
        "resize",
        scheduleRemeasure
      );


      window.addEventListener(
        "orientationchange",
        scheduleRemeasure
      );


      window.addEventListener(
        "load",
        remeasure
      );


      if (document.fonts && document.fonts.ready) {

        document.fonts.ready.then(
          scheduleRemeasure
        );

      }


      if (
        typeof stageQuery.addEventListener === "function"
      ) {

        stageQuery.addEventListener(
          "change",
          scheduleRemeasure
        );

      }


      /*
        Qualquer mudança de layout da página
        (imagens carregando, fontes, etc.)
        reposiciona os pontos de referência.
      */

      if ("ResizeObserver" in window) {

        const layoutObserver =
          new ResizeObserver(
            scheduleRemeasure
          );

        layoutObserver.observe(
          document.body
        );

      }

    }

  }
);
