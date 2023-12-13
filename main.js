window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.href +=
      (window.location.href.indexOf("?") === -1 ? "?" : "&") +
      new Date().getTime();
  }
});
window.addEventListener("DOMContentLoaded", function () {
  let queryIDS = [];
  const cardFetchQueryParam = new URLSearchParams(window.location.search);
  console.log("Loaded");
  if (cardFetchQueryParam) {
    for (const key of cardFetchQueryParam.keys()) {
      if (key === "card-num") {
        const cardNumberParam = [...cardFetchQueryParam.get(key).split(",")];
        queryIDS = cardNumberParam;
      }
    }
  }
  const pageID = document
    .querySelector("#get-page-id")
    .getAttribute("data-page-id");

  const chosenCardsInfo = document.querySelector(".chosen-card-info");
  let createDivInfo = "";
  const cardsPlay = document.querySelector(".cards-play");
  const innerArrData = document.querySelector(".card-container");
  const randomStart = Math.floor(Math.random() * 10);
  const randomEnd = Math.floor(Math.random() * 10);
  const shuffle = document.querySelector(".shuffle");

  let divElement = document.querySelector(".card-container");
  let divWidth = divElement.offsetWidth;

  let mm = gsap.matchMedia();
  const shuffleAmount = [];
  let addedCards = 0;
  let selectedCards = 3;
  let cardBgImage = "";
  let pageResUrl = "";
  let selectedIDs = [];
  let chosenCards = [];
  let allCards = [];
  let cardIDsA = [];
  let cardIDsB = [];
  let cardIDsC = [];

  const API_URL =
    "https://graphql.contentful.com/content/v1/spaces/ztycyt6fui85";

  const API_URL_WP = "https://angelic-guidance.us/graphql";

  const wpPageDataQuery = `query NewQuery {
                  page(id: "${pageID}", idType: DATABASE_ID) {
                    cardFields {
                      amountOfCards
                      pageResult {
                        ... on Page {
                          link
                        }
                      }
                      cardBackgroundImage {
                        sourceUrl
                      }
                    }
                  }
                }`;
  const idQuery = `{
                loveAndSupportAngelCardsCollection(where:
                {sys: {id_in: ${queryIDS}}}) {
                  items {
                    title
                  }
                }
              }`;
  const query = `query{
                        loveAndSupportAngelCardsCollection{
                            items
                            {featuredImage{url}}
                            items{sys{id}}
                            items{title}
                            items{shortDescription{json}}
                            items{longDescription{
                                json
                            }}
                        }
                        }`;
  const apiData = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sf2L6218tLXSvrkMDRdSCr58JhZRCbb1RI4jd2ojfPY",
      },
    });

    const jsonData = await res.json();
    const ANGELIC_CARDS =
      jsonData.data.loveAndSupportAngelCardsCollection.items;

    const shuffledArr = ANGELIC_CARDS.sort(function () {
      return 0.5 - Math.random();
    });

    const selectedArr = shuffledArr.slice(0, 24);
    constructDOM(selectedArr);
  };

  const wpData = async () => {
    const resWP = await fetch(API_URL_WP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: wpPageDataQuery }),
    });
    const jsonDataWP = await resWP.json();
    const cardFields = jsonDataWP.data.page.cardFields;
    selectedCards = cardFields.amountOfCards;
    cardBgImage = cardFields.cardBackgroundImage.sourceUrl;
    pageResUrl = cardFields.pageResult.link;
    apiData();
  };
  wpData();

  const constructDOM = function (data) {
    let splitArr = Math.ceil(data.length / 3);
    cardConstruct(data);
  };
  const cardConstruct = function (data, div) {
    data.forEach(function (el, i) {
      let cardEl = `<div class="card"
            style="margin-left:${2 * i}px;
            z-index:${10 + i};
            background-image:url(${cardBgImage})"
            data-id=${el.sys.id}>
            </div>`;
      innerArrData.innerHTML += cardEl;
    });
    const innerCards = document.querySelectorAll(".card");
    const exttractedArr = [...innerCards].slice(-18);

    let lengthCards = innerCards.length; // get the length of the array
    let sliceLength = Math.floor(lengthCards / 3); // get the size of each slice
    allCards = [...innerCards];
    cardIDsA = [...innerCards].slice(0, sliceLength); // get the first slice
    cardIDsB = [...innerCards].slice(sliceLength, 2 * sliceLength); // get the second slice
    cardIDsC = [...innerCards].slice(2 * sliceLength);
    selectedIDs.push(exttractedArr);
  };
  shuffle.addEventListener("click", scaleShuffle);

  function scaleShuffle() {
    for (let i = 0; i < selectedCards; i++) {
      createDivInfo += `<div class="chosen-card chosen-card-${i}"></div>`;
    }
    document.querySelector(".chosen-cards-info").innerHTML = createDivInfo;
    document.querySelector(".shuffle").style.display = "none";
    const shuffleGSAP = gsap.timeline({
      onComplete: () => {
        mm.add("(max-width: 500px)", () => {
          let nextROW = 190;

          innerArrData.style.paddingBottom = `${nextROW * 2}px`;
          return mobileCardsSpread(nextROW);
        });
        mm.add("(max-width: 999px) and (min-width: 501px)", () => {
          let nextROW = 220;

          innerArrData.style.height = `${nextROW * 3 + 100}px`;
          return tabletCardsSpread(nextROW);
        });
        mm.add("(min-width: 1000px)", () => {
          return desktopCardsSpread();
        });
      },
    });

    shuffleGSAP
      .to(".action-shuffle", { opacity: 0 })
      .to(".action-shuffle-info", { opacity: 1 })
      .to(allCards, {
        xPercent: -130,
      })
      .to(selectedIDs, {
        xPercent: "random(70,95,1)",
        stagger: {
          from: "random",
          amount: 0.7,
          repeat: 1,
          yoyo: true,
        },
        rotationZ: "120",
        rotationX: "100",

        // yoyo: true,
        repeat: 1,
      })
      .to(".card", { scale: 0.8 })
      .to(".card", { y: 0, translateX: 0 })
      .to(allCards, {
        marginLeft: "0",
        left: 0,
        xPercent: 50,
        yPercent: 0,
      });
  }
  const mobileCardsSpread = function (nextROW) {
    const isMobileGSAP = gsap.timeline({
      onComplete: () => {
        selectCards();
      },
    });
    callAnimation(isMobileGSAP, nextROW, 0);
  };
  const tabletCardsSpread = function (nextROW) {
    const isTabletGSAP = gsap.timeline({
      onComplete: () => {
        selectCards();
      },
    });

    callAnimation(isTabletGSAP, nextROW, 4);
  };
  const desktopCardsSpread = function () {
    const isDesktopGSAP = gsap.timeline({
      onComplete: () => {
        selectCards();
      },
    });
    const calcWidth = (divWidth / 100) * 1 + 50;
    isDesktopGSAP
      .to(allCards, { left: 0, xPercent: 0, yPercent: 0 })
      .to(allCards, {
        x: function (i, allCards) {
          return 50 * i - i * 15;
        },
        stagger: { amount: 0.005 },
      });
  };

  function selectCards() {
    const addedCardsInfo = document.querySelectorAll(".chosen-card");
    const popupGSAP = gsap.timeline();
    popupGSAP
      .to(".action-shuffle-info", { opacity: 0, duration: 0.2 })
      .to(".action-choose-cards", { opacity: 1 })
      .to(".info-txt-container", { height: 100 })
      .to(".chosen-card", { opacity: 1, stagger: 0.3 });
    for (c of allCards) {
      c.style.transition = "all .3s ease !important";
      c.style.cursor = "pointer";
      c.addEventListener("click", function (e) {
        let amountSelected = e.target.classList.toggle("added");
        let dataIds = e.target.getAttribute("data-id");

        if (amountSelected) {
          addedCards++;
          chosenCards.push(dataIds);
        } else {
          addedCards--;
          chosenCards = chosenCards.filter((e) => {
            return e != dataIds;
          });
        }

        addedCardsInfo.forEach((c) => {
          c.classList.remove("ret");
          c.style = `background-image:none;opacity:1;`;
        });

        chosenCards.forEach((id, i) => {
          if (i < addedCardsInfo.length) {
            addedCardsInfo[i].classList.add("ret");
            addedCardsInfo[
              i
            ].style = `background-image:url(${cardBgImage});opacity:1`;
          }
        });
        if (addedCards >= selectedCards) {
          document.querySelector(
            ".card-anim-bg"
          ).style = `background-image:url(${cardBgImage})`;
          popupGSAP
            .to(".cards-popup", {
              opacity: 1,
              zIndex: 1000,
              visibility: "visible",
            })
            .to(".gsap-p-1", {
              opacity: 1,
              y: -15,
              ease: "back",
            })
            .to(".gsap-p-2", {
              delay: 2,
              opacity: 1,
              y: -10,
              ease: "back",
              yoyo: true,
              repeat: -1,
            });
          let urlIDs = chosenCards.join(",");
          const fullURL = `${pageResUrl}?card-num=${urlIDs}`;
          window.open(fullURL, "_self");

          for (c of allCards) {
            c.classList.add("events_none");
            addedCards = 0;
          }
        }
      });
    }
  }
  const callAnimation = (isResponsive, nextROW, widthNum) => {
    const calcWidth = (divWidth / 100) * widthNum + 50;
    isResponsive
      .to(cardIDsA, {
        xPercent: 0,
        yPercent: 0,
        x: function (i, cardIDsA) {
          return calcWidth * i - i * 15;
        },
        stagger: { amount: 0.005 },
      })
      .to(cardIDsB, {
        y: nextROW,
        left: 0,
        xPercent: 0,
        yPercent: 0,
      })
      .to(cardIDsB, {
        x: function (i, cardIDsB) {
          return calcWidth * i - i * 15;
        },
        stagger: { amount: 0.005 },
      })
      .to(cardIDsC, {
        y: nextROW * 2,
        left: 0,
        xPercent: 0,
        yPercent: 0,
      })
      .to(cardIDsC, {
        x: function (i, cardIDsC) {
          return calcWidth * i - i * 15;
        },
        stagger: { amount: 0.005 },
      });
  };
});
