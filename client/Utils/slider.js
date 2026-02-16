let animationTime = 1000;
let abApiSetting = {};
var fixedElementSelect;
var fixedElementSelectTop;
var fixedElementSelectSetTop;
var removeTimeout;
var removeInterval;
var abDefault = ["[data-section-id=header]", "header", ".header", ".site-header"];
var countryData;
let animationIn;
let animationOut;
let mobile = "";
let tmpArrForHorizontalSlides = [];
let tmpArrInit = true;
var fontsArr = [];
var stopDuplication = false;
var slideHeight;
window.shipping = [];
window.webapp = true;
var previewSelector;
var mobileview;
//added for horizontal sliding
var announceElement, bodyWidth, totalSlideWidth, count;
var animationData = {};

export function loadSlider(data, mobile, selected, animationSetting) {
  abApiSetting = data;
  animationData = animationSetting;
  previewSelector = selected;
  mobileview = mobile;

  let countrySetting = false;
  // if (abApiSetting.plan == "Premium") {
  //   for (let i = 0; i < abApiSetting.annoucements.length; i++) {
  //     let data = abApiSetting.annoucements[i];
  //     if (data.countryData) {
  //       if (data.countryData.length > 0) {
  //         countrySetting = true;
  //         break;
  //       }
  //     }
  //   }
  // }
  if (countrySetting) {
    httpGetAsync("https://pro.ip-api.com/json/?fields=countryCode&key=SXs3XvNnKoUQP2y", setCountry);
  } else {
    sliderLoadLogic();
  }
}

function setCountry(data) {
  countryData = JSON.parse(data).countryCode;
  sliderLoadLogic();
}
function createControls() {
  const controls = document.createElement("div");
  controls.classList.add("ab-controls");
  const prevArrow = document.createElement("div");
  prevArrow.classList.add("ab__arrow", "ab__arrows_prev");
  prevArrow.innerHTML = `
    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16C11.744 16 11.488 15.902 11.293 15.707L6.29301 10.707C5.90201 10.316 5.90201 9.68401 6.29301 9.29301L11.293 4.29301C11.684 3.90201 12.316 3.90201 12.707 4.29301C13.098 4.68401 13.098 5.31601 12.707 5.70701L8.41401 10L12.707 14.293C13.098 14.684 13.098 15.316 12.707 15.707C12.512 15.902 12.256 16 12 16Z" fill="#6d7175"></path>
    </svg>
  `;
  const nextArrow = document.createElement("div");
  nextArrow.classList.add("ab__arrow", "ab__arrows_next");
  nextArrow.innerHTML = `
    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.00001 16C7.74401 16 7.48801 15.902 7.29301 15.707C6.90201 15.316 6.90201 14.684 7.29301 14.293L11.586 10L7.29301 5.70701C6.90201 5.31601 6.90201 4.68401 7.29301 4.29301C7.68401 3.90201 8.31601 3.90201 8.70701 4.29301L13.707 9.29301C14.098 9.68401 14.098 10.316 13.707 10.707L8.70701 15.707C8.51201 15.902 8.25601 16 8.00001 16Z" fill="#6d7175"></path>
    </svg>
  `;
  controls.appendChild(prevArrow);
  controls.appendChild(nextArrow);
  return controls;
}

function sliderLoadLogic() {
  if (animationData?.customCss) {
    const style = document.createElement("style");
    style.innerHTML = animationData.customCss;
    document.head.appendChild(style);
  }
  if (abApiSetting) {
    let carouselElement = document.createElement("div");
    carouselElement.id = "announcement-bar-with-slider";
    carouselElement.setAttribute("company", "webrex-studio");
    carouselElement.classList.add("ab-slider");
    carouselElement.classList.add("announcement-bar-with-slider");
    slideHeight = [];
    tmpArrForHorizontalSlides = [];
    let index = 0;
    if (abApiSetting?.animationType === "multiRotating") {
      carouselElement.appendChild(createControls());
    }
    let horiZontalSlider = document.createElement("div");
    horiZontalSlider.classList.add("horizontal-slider");
    const hSliderWrapper = document.createElement("div");
    hSliderWrapper.classList.add("marquee__content", "horizontal-slider-wrapper");
    hSliderWrapper.setAttribute("id", "horizontal-slider-wrapper");
    hSliderWrapper.appendChild(horiZontalSlider);
    // abApiSetting.annoucements.forEach((slide) => {
    if (tmpArrInit) {
      let tmpObj = {};
      tmpObj["slide"] = abApiSetting;
      tmpObj["index"] = index;
      tmpObj["slideHeight"] = slideHeight;
      tmpArrForHorizontalSlides.push(tmpObj);
    }
    if (abApiSetting.animationType === "marquee") {
      horiZontalSlider.appendChild(generateHtmlForslide(abApiSetting, index, slideHeight));
    } else {
      carouselElement.appendChild(generateHtmlForslide(abApiSetting, index, slideHeight));
    }

    //   index++;
    // });

    fontsArr = [];
    // abApiSetting.annoucements.forEach((slide) => {
    abApiSetting.htmlDesign.forEach((slide) => {
      if (slide.type === "Text" || slide.type === "freeShippingBar") {
        const isMobile = window.innerWidth < 600;
        const settings = isMobile
          ? slide.mobileSetting
            ? slide.mobileSetting
            : slide.desktopSetting
          : slide.desktopSetting;
        if (settings.fontFamilyEnabled) {
          fontsArr.push(replaceString(settings.fontFamily));
        }
      }
    });
    // });
    var importString = "https://fonts.googleapis.com/css2?display=swap";
    var and = "&";
    fontsArr.forEach((font) => {
      importString += and + "family=" + font;
    });
    if (importString != "https://fonts.googleapis.com/css2?display=swap") {
      addStylesheetURL(importString);
    }

    if (abApiSetting.animationType === "marquee") {
      carouselElement.appendChild(hSliderWrapper);
    }

    slideHeight = Math.max(...slideHeight);
    sliderPosition(carouselElement, slideHeight);
    sliderLoad();
    updatePreview();
    // tmpArrInit = false;
  }
}
function updateSlideContent(previewSelector, wsShippingElements) {
  wsShippingElements.forEach((wsShippingElement) => {
    const firstSpan = wsShippingElement.querySelector("span[progress-start-msg]");
    const secondSpan = wsShippingElement.querySelector("span[price-data]");
    const thirdSpan = wsShippingElement.querySelector("span[progress-end-msg]");

    if (firstSpan && secondSpan && thirdSpan) {
      const progressStartMsg = firstSpan.getAttribute("progress-start-msg");
      const goalMsg = firstSpan.getAttribute("gole-msg"); // Assuming this was a typo
      const priceData = parseFloat(secondSpan.getAttribute("price-data"));
      const currency = secondSpan.getAttribute("currency");
      const position = secondSpan.getAttribute("position");
      const progressEndMsg = thirdSpan.getAttribute("progress-end-msg");

      if (previewSelector === "goalMessage") {
        firstSpan.textContent = goalMsg;
        secondSpan.textContent = "";
        thirdSpan.textContent = "";
      } else {
        const discountedPrice = ((priceData * 20) / 100).toFixed(2);
        firstSpan.textContent = `${progressStartMsg} `;
        secondSpan.textContent =
          position === "before" ? `${currency}${discountedPrice}` : `${discountedPrice}${currency}`;
        thirdSpan.textContent = progressEndMsg;
      }
    }
  });
}

function updatePreview() {
  const slideContents = document.querySelectorAll(".ab-slide-content");
  if (slideContents.length > 0) {
    //update when show email thanksMessage
    if (previewSelector === "thanksMessage") {
      if (slideContents.length >= 2) {
        slideContents[0].classList.remove("active");
        slideContents[0].style.display = "none";
        slideContents[1].classList.add("active");
        slideContents[1].style.cssText += "display: block !important;";
      }
    } else {
      slideContents[0].classList.add("active");
    }

    if (previewSelector !== "message") {
      const wsShippingElements = document.querySelectorAll("#announcement-bar-with-slider .ab-slide-shipping h4");

      if (wsShippingElements.length > 0) {
        updateSlideContent(previewSelector, wsShippingElements);
      }

      if (abApiSetting.animationType === "marquee") {
        handleslidesizings();
        const newWsShippingElements = document.querySelectorAll(
          "#announcement-bar-with-slider .ab-slide-shipping h4"
        );

        if (newWsShippingElements.length > 0) {
          updateSlideContent(previewSelector, newWsShippingElements);
        }
      }
    }
  }
}

function sliderPosition(carouselElement) {
  if (abApiSetting.slidePosition === "fixed") {
    carouselElement.style = ` z-index: 100000; top:0px; height:${slideHeight}px;`;
    insertBeforePreviewHeightFirst(carouselElement);
  } else if (abApiSetting.slidePosition === "bottomFixed") {
    carouselElement.style = `position:fixed; z-index: 100000; bottom:0px; height:${slideHeight}px; overflow:hidden; width:${
      mobileview ? "100%" : "calc(100% - 352px)"
    };`;
    insertBeforePreviewHeightLast(carouselElement);
  } else if (abApiSetting.slidePosition === "CustomPosition") {
    carouselElement.style = ` z-index: 100000; top:0px; height:${slideHeight}px;`;
    insertBeforePreviewHeightFirst(carouselElement);
  } else if (abApiSetting.slideType === "embeded") {
    carouselElement.style = "height: " + slideHeight + "px;overflow: hidden;border-radius: 5px;";
    let customPosition = document.querySelector(".preview-atc");
    if (customPosition) {
      if (abApiSetting.slidePosition === "beforeAddtoCart") {
        customPosition.before(carouselElement);
      } else if (abApiSetting.slidePosition === "afterAddtoCart") {
        customPosition.after(carouselElement);
      }
    } else {
      document.body.insertBefore(carouselElement, document.body.firstElementChild);
    }
  } else {
    carouselElement.style = `height: ${slideHeight}px; transition: 0.5s; top:0px; overflow:hidden;`;
    insertBeforePreviewHeightFirst(carouselElement);
  }

  function insertBeforePreviewHeightFirst(element) {
    let previewHeightElement = document.querySelector(".preview-bar");
    if (previewHeightElement && previewHeightElement.firstElementChild) {
      previewHeightElement.insertBefore(element, previewHeightElement.firstElementChild);
    } else if (previewHeightElement) {
      previewHeightElement.appendChild(element);
    }
  }

  function insertBeforePreviewHeightLast(element) {
    let previewHeightElement = document.querySelector(".preview-bar");
    if (previewHeightElement && previewHeightElement.lastElementChild) {
      previewHeightElement.insertBefore(element, previewHeightElement.lastElementChild);
    } else if (previewHeightElement) {
      previewHeightElement.appendChild(element);
    }
  }
}

function Notification(Title, Message, Icon) {
  var obj = {};
  obj.progress = 0;
  obj.fadeTime = 1000;
  obj.fadeTicks = 50;
  obj.fadeInterval = 0;
  obj.opacity = 1;
  obj.time = 2;
  obj.ticks = 50;
  obj.element = null;
  obj.progress = null;
  obj.progressPos = 0;
  obj.progressIncrement = 0;
  obj.Show = function () {
    obj.element = document.createElement("div");
    obj.element.className = "Notification " + Icon;
    let image = document.createElement("div");
    image.onclick = function () {
      obj.Clear();
    };
    image.className = "Image";
    obj.element.appendChild(image);
    let content = document.createElement("div");
    content.className = "Content";
    content.innerHTML = "" + "<h2>" + Title + "</h2>" + "";
    obj.element.appendChild(content);
    var progressDiv = document.createElement("div");
    progressDiv.className = "ProgressDiv";
    obj.progress = document.createElement("div");
    progressDiv.appendChild(obj.progress);
    obj.element.appendChild(progressDiv);
    obj.progressIncrement = 100 / obj.ticks;
    document.getElementById("Notifications").appendChild(obj.element);
    obj.StartWait();
  };
  obj.StartWait = function () {
    if (obj.progressPos >= 100) {
      obj.fadeInterval = 1;
      obj.FadeTick();
      return;
    }
    setTimeout(obj.Tick, obj.time);
  };
  obj.Clear = function () {
    obj.opacity = 0;
    obj.progressPos = 100;
    obj.element.remove();
    obj = null;
    return;
  };
  obj.FadeTick = function () {
    obj.opacity = (obj.opacity * 100 - obj.fadeInterval) / 100;
    if (obj.opacity <= 0) {
      obj.element.remove();
      obj = null;
      return;
    }
    obj.element.style.opacity = obj.opacity;
    setTimeout(obj.FadeTick, obj.fadeTime / obj.fadeTicks);
  };
  obj.Tick = function () {
    obj.progressPos += obj.progressIncrement;
    obj.progress.style.width = obj.progressPos + "%";
    obj.StartWait();
  };
  obj.Show();
  return obj;
}

function slideRemove() {
  let html = document.createElement("div");
  html.setAttribute("class", "ab-slide-remove");
  if (abApiSetting.rmvBtnEnabled) {
    html.addEventListener("click", removeAnnouncement, false);
    html.innerHTML =
      '<svg fill="' +
      abApiSetting.rmvBtnColor +
      '" height="15px" viewBox="0 0 329.26933 329" width="15px" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>';
  } else {
    html = false;
  }
  return html;
}

function getCorrespondingValue(orignalV1, currentV1, originalV2, type) {
  let result = (parseFloat(currentV1) * parseFloat(originalV2)) / parseFloat(orignalV1);
  if (type == "px") {
    result = parseFloat(result).toFixed(2) + "px";
  } else if (type == "sec") {
    result = parseFloat(result).toFixed(2) + "s";
  } else if (type == "percent") {
    result = parseFloat(result).toFixed(2) + "%";
  }
  return result;
}

export function generateHtmlForslide(slideSettings, index, slideHeight) {
  let slideSetting;
  if (mobileview) {
    slideSetting = mobileview
      ? slideSettings.htmlLayout.mobile
        ? slideSettings.htmlLayout.mobile
        : slideSettings.htmlLayout.desktop
      : slideSettings.htmlLayout.desktop;
  } else {
    mobile = screen.width < 600 ? "mobile" : "";
    slideSetting = mobile
      ? slideSettings.htmlLayout.mobile
        ? slideSettings.htmlLayout.mobile
        : slideSettings.htmlLayout.desktop
      : slideSettings.htmlLayout.desktop;
  }
  const slide = document.createElement(slideSetting.element);

  if (slideSetting.attribute) {
    for (let key in slideSetting.attribute) {
      if (key === "class") {
        slideSetting.attribute[key] = index === 0 ? "ab-slide active" : "ab-slide";
      }
      slide.setAttribute(key, slideSetting.attribute[key]);
    }
  }
  if (slideSetting.style) {
    if (abApiSetting.animationType === "marquee") {
      const selectedStyle = `background: ${
        slideSettings.backgroundColor
          ? slideSettings.backgroundColor
          : mobile
          ? slideSettings.mobilebackgroundColor
            ? slideSettings.mobilebackgroundColor
            : slideSettings.backgroundColor
          : slideSettings.backgroundColor
      }; padding: ${abApiSetting.slidePadding}px; font-family: ${slideSetting.style.fontFamily};`;
      slide.style.cssText = selectedStyle;
      if (abApiSetting.textAnimationPadding) {
        const ov1 = abApiSetting.textAnimationWidth || 0;
        const cv1 = document.body ? document.body.offsetWidth : 0;
        const ov2 = abApiSetting.textAnimationPadding || 0;

        if (ov1 && cv1 && ov2) {
          const tmpPadding = getCorrespondingValue(ov1, cv1, ov2, "px");
          slide.style.paddingLeft = tmpPadding;
          slide.style.paddingRight = tmpPadding;
        } else {
          slide.style.paddingLeft = `${abApiSetting.textAnimationPadding}px`;
          slide.style.paddingRight = `${abApiSetting.textAnimationPadding}px`;
        }
      }
    } else {
      const selectedStyle = mobile && slideSetting.mobilestyle ? slideSetting.mobilestyle : slideSetting.style;
      selectedStyle.padding = `${abApiSetting.slidePadding}px`;
      for (let prop in selectedStyle) {
        slide.style[prop] = selectedStyle[prop];
      }
    }
  }

  if (slideSetting.child) {
    const childElements = createDiv(slideSetting.child, mobile, index, slideSetting);
    for (const childElement of childElements) {
      slide.appendChild(childElement);
    }
  }

  let cln = slide.cloneNode(true);
  const heightValue = getElementHeight(cln.querySelector(".ab-slide-content"), slideSettings);
  slideHeight.push(heightValue);

  return slide;
}

function createDiv(values, mobile, index, slideSetting) {
  const divElements = [];

  for (let value of values) {
    let div;
    if (value.attribute && value.attribute.class === "ab-slide-remove" && abApiSetting.rmvBtnEnabled) {
      div = slideRemove();
    } else {
      div = document.createElement(value.element);

      if (value.attribute) {
        for (let key in value.attribute) {
          if (key === "href" && value.attribute.href === "javascript:void(0);") {
            continue; // Skip setting href when the condition is true
          }
          if (key === "target") {
            value.attribute.target = value.attribute.target === "_blank" ? null : "_blank";
          }
          div.setAttribute(key, value.attribute[key]);
        }
      }
      if (value.textContent) {
        if (value.element !== "style") {
          div.innerHTML = value.textContent;
        } else {
          let modifiedTextContent;
          if (value.textContent.includes("#announcement-bar-with-slider .ab-slide:nth-child .ab-slide-btn")) {
            modifiedTextContent = value.textContent.replace(
              /#announcement-bar-with-slider .ab-slide:nth-child/g,
              `#announcement-bar-with-slider .ab-slide:nth-child(${index + 1})`
            );
          } else {
            modifiedTextContent = value.textContent.replace(/nth-child/g, `nth-child(${index + 1})`);
          }

          let cssRule = modifiedTextContent + " {";
          const styles = value.otherStyle;
          if (styles) {
            for (let prop in styles) {
              cssRule += prop + ":" + styles[prop] + ";";
            }
          }
          cssRule += "}";
          div.textContent = cssRule;
        }
      }

      if (value.style) {
        const selectedStyle = mobile && value.mobilestyle ? value.mobilestyle : value.style;
        for (let prop in selectedStyle) {
          div.style[prop] = selectedStyle[prop];
        }
      }
      if (value.child) {
        for (let childValue of value.child) {
          if (typeof childValue === "string") {
            const childElement = document.createTextNode(childValue);
            div.appendChild(childElement);
          } else {
            const childElements = createDiv([childValue], mobile, index, slideSetting);
            if (Array.isArray(childElements)) {
              for (const childElement of childElements) {
                div.appendChild(childElement);
              }
            }
          }
        }
      }
      if (value.attribute && value.attribute.class === "ab-slide-btn" && value.attribute.copyText) {
        updateNotification(div);
      }

      if (value.attribute && value.attribute.class === "ab-clock") {
        updateClock(div);
      }
      if (value.attribute && value.attribute.class === "ab-slide-email") {
        updateEmail(div, slideSetting);
      }
      if (value.attribute && value.attribute.class === "Quantity") {
        updateVariant(div);
      }
    }
    divElements.push(div);
  }

  if (slideSetting.slideType === "shippingBar") {
    if (NODE_ENV !== "dev" || NODE_ENV !== "stg") {
      wsab_httpGetAsync("/cart.json", (data) => {
        upDateShippingElement(JSON.parse(data).original_total_price / 100);
      });
    }
  }

  return divElements;
}

function updateVariant(div) {
  let inputElement = div.querySelector(".quantityInput");
  var cutButton = div.querySelector(".Quantity_Cut");
  var addButton = div.querySelector(".Quantity_Add");

  cutButton.addEventListener("click", function () {
    var newValue = parseInt(inputElement.value, 10) - 1;
    inputElement.value = Math.max(newValue, 1); // Ensure the value doesn't go below 0
  });

  addButton.addEventListener("click", function () {
    var newValue = parseInt(inputElement.value, 10) + 1;
    inputElement.value = newValue;
  });
}

function updateEmail(div, slideSetting) {
  const emailSubscribe = div.querySelectorAll(".ab-slide-btn");

  for (let i = 0; i < emailSubscribe.length; i++) {
    const button = emailSubscribe[i];
    const buttonType = button.getAttribute("data-type");

    if (buttonType === "Contact-Submit") {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }
  }
}

function updateNotification(notificationElement) {
  const buttonsInNotification = notificationElement.querySelectorAll(".ab-slide-btn a");

  for (let i = 0; i < buttonsInNotification.length; i++) {
    const button = buttonsInNotification[i];
    const copiedText = button.getAttribute("copied-text");

    button.addEventListener("click", function () {
      const textToCopy = copiedText;
      const textArea = document.createElement("textarea");
      textArea.style.position = "fixed";
      textArea.style.left = "0";
      textArea.style.top = "0";
      textArea.style.opacity = "0";
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      const copyMassage = copiedText && copiedText.length > 0 ? copiedText : "Copied successfully";
      Notification(copyMassage, "good");
    });
  }
}

function upDateShippingElement(cartValue) {
  const wsShippingElements = document.querySelectorAll("#announcement-bar-with-slider .ab-slide-shipping h4");
  for (let i = 0; i < wsShippingElements.length; i++) {
    const wsShippingElement = wsShippingElements[i];

    const firstSpan = wsShippingElement.querySelector("span[progress-start-msg]");
    const secondSpan = wsShippingElement.querySelector("span[price-data]");
    const thirdSpan = wsShippingElement.querySelector("span[progress-end-msg]");

    const progressStartMsg = firstSpan.getAttribute("progress-start-msg");
    const goalMsg = firstSpan.getAttribute("gole-msg");
    const priceData = secondSpan.getAttribute("price-data");
    const currency = secondSpan.getAttribute("currency");
    const position = secondSpan.getAttribute("position");
    const progressEndMsg = thirdSpan.getAttribute("progress-end-msg");

    let goal = cartValue >= priceData;
    if (cartValue > 0) {
      firstSpan.textContent = goal ? goalMsg : progressStartMsg + " ";

      if (!goal) {
        secondSpan.textContent =
          position === "before"
            ? currency + (parseInt(priceData) - cartValue).toFixed(2)
            : (parseInt(priceData) - cartValue).toFixed(2) + currency;
      } else {
        secondSpan.textContent = "";
      }
      thirdSpan.textContent = goal ? "" : progressEndMsg;
    }
  }
}

function updateClock(div) {
  const clockElements = div.querySelectorAll(".ab-clock ul[clock-type]");

  for (let clock of clockElements) {
    const timerType = clock.getAttribute("clock-type");
    const timerDate = clock.getAttribute("date");
    const repeatedHours = clock.getAttribute("repeatedHours");
    const repeatTimerCreateDate = clock.getAttribute("repeatTimerCreateDate");
    const removetimer = clock.getAttribute("removetimer");

    let countDownDate;

    if (timerType === "normal") {
      if (removetimer === "true" && new Date(Date.parse(timerDate)) < new Date()) {
        countDownDate = null;
      } else {
        countDownDate = new Date(timerDate);
      }
    } else {
      countDownDate = {};
      let convertInMiliSecond = repeatedHours * 3600 * 1000;
      let timeDiff = new Date().getTime() - new Date(repeatTimerCreateDate).getTime();
      let remainingDiff = 1 - (timeDiff / convertInMiliSecond - Math.floor(timeDiff / convertInMiliSecond));
      let newDate = new Date(new Date().getTime() + remainingDiff * convertInMiliSecond);
      countDownDate = newDate;
    }
    const valueSpans = div.querySelectorAll("span");

    function updateClockValues() {
      for (let span of valueSpans) {
        const elementId = span.id;
        span.textContent = minTwoDigits(getValueForElement(elementId, countDownDate));
      }
    }
    countDownDate && updateClockValues();
    !countDownDate && clock.remove();
    const updateClockInterval = setInterval(function () {
      if (!div.parentElement || countDownDate === null) {
        clearInterval(updateClockInterval);
        clock.remove();
      } else {
        updateClockValues();
      }
    }, 1000);
  }
}

function getValueForElement(elementId, countdown) {
  const now = new Date().getTime();
  const distance = countdown - now;

  if (distance > 0) {
    switch (elementId) {
      case "days":
        return minTwoDigits(Math.floor(distance / (1000 * 60 * 60 * 24)));
      case "hours":
        return minTwoDigits(Math.floor((distance / (1000 * 60 * 60)) % 24));
      case "minutes":
        return minTwoDigits(Math.floor((distance / 1000 / 60) % 60));
      case "seconds":
        return minTwoDigits(Math.floor((distance / 1000) % 60));
      default:
        return "00";
    }
  } else {
    return "00";
  }
}

function minTwoDigits(n) {
  return String(n).padStart(2, "0");
}

function getElementHeight(slide, slideSettings) {
  const slideForHeight = document.createElement("div");
  slideForHeight.style.visibility = "hidden";
  slideForHeight.classList.add("ab-slide");
  if (slideSettings.slideType === "embeded") {
    // slideForHeight.style.width = mobileview ? "321px" : "546px";
    slideForHeight.style.width = "321px";
  } else {
    slideForHeight.style.width = mobileview ? "419px" : window.innerWidth < 600 ? "100%" : "calc(100% - 352px)";
  }
  slideForHeight.style.padding =
    slideSettings && slideSettings.slidePadding && slideSettings.slidePadding != ""
      ? slideSettings.slidePadding.toString() + "px"
      : "8px 25px";

  if (slideSettings.animationType === "marquee") {
    slideForHeight.style.position = "absolute";
    slideForHeight.style.width = "max-content";
  }

  slideForHeight.appendChild(slide);
  document.body.appendChild(slideForHeight);

  const heightValue = slideForHeight.clientHeight;

  slideForHeight.remove();

  return heightValue;
}

function duplicateSlides(sliderContainer, targetLength) {
  let slides = sliderContainer.getElementsByClassName("ab-slide");
  let currentLength = slides.length;

  if (currentLength === 0) return; // Avoid duplication if no slides present

  let duplicationFactor = Math.ceil(targetLength / currentLength);

  for (let i = 0; i < duplicationFactor; i++) {
    Array.from(slides).forEach((slide) => {
      let clone = slide.cloneNode(true);
      sliderContainer.appendChild(clone);
    });
  }
}

function sliderLoad() {
  if (abApiSetting.animationType === "marquee") {
    initialSlides();
    handleslidesizings();
  } else {
    let sliderInfo = {
      slides: document.getElementsByClassName("ab-slide"),
      totalSlide: document.getElementsByClassName("ab-slide").length,
      currentSlide: 0,
      nextSlide: function () {
        return this.currentSlide + 1 > this.totalSlide - 1 ? 0 : this.currentSlide + 1;
      },
      prevSlide: function () {
        return this.currentSlide - 1 < 0 ? this.totalSlide - 1 : this.currentSlide - 1;
      },
    };

    removeTimeout = setTimeout(() => {
      if (sliderInfo.totalSlide > 1) {
        sliderInfo.currentSlide = sliderInfo.nextSlide();
        slider(sliderInfo);
        removeInterval = setInterval(() => {
          if (sliderInfo.totalSlide > 1) {
            sliderInfo.currentSlide = sliderInfo.nextSlide();
            slider(sliderInfo);
          }
        }, animationData.animationTime + animationData.autoplayTime);
      }
    }, animationData.autoplayTime);
  }
  if (abApiSetting?.animationType === "multiRotating") {
    let allSliders = document.querySelector(".announcement-bar-with-slider");
    const targetLength = allSliders?.getElementsByClassName("ab-slide")?.length || 0;
    duplicateSlides(allSliders, targetLength);
    let sliderInfo = {
      slides: allSliders.getElementsByClassName("ab-slide"),
      totalSlide: allSliders?.getElementsByClassName("ab-slide")?.length || 0,
      autoplayTime: abApiSetting.autoplayTime || animationData.autoplayTime, // Corrected order
      animationTime: abApiSetting.animationTime || animationData.animationTime, // Corrected order
      currentSlide: 0,
      nextSlide: function () {
        return this.currentSlide + 1 >= this.totalSlide ? 0 : this.currentSlide + 1;
      },
      prevSlide: function () {
        return this.currentSlide - 1 < 0 ? this.totalSlide - 1 : this.currentSlide - 1;
      },
    };

    sliderInfo.slides[sliderInfo.currentSlide].classList.add("active");
    let removeInterval;

    function startAutoplay() {
      if (sliderInfo.totalSlide > 1) {
        removeInterval = setInterval(() => {
          sliderInfo.currentSlide = sliderInfo.nextSlide();
          multiSlider(sliderInfo, "next");
        }, sliderInfo.autoplayTime + sliderInfo.animationTime);
      }
    }

    const nextButton = allSliders.querySelector(".ab__arrows_next");
    const prevButton = allSliders.querySelector(".ab__arrows_prev");

    startAutoplay();
    nextButton.addEventListener("click", () => {
      clearInterval(removeInterval);
      sliderInfo.currentSlide = sliderInfo.nextSlide();
      multiSlider(sliderInfo, "next");
      startAutoplay();
    });

    prevButton.addEventListener("click", () => {
      clearInterval(removeInterval);
      sliderInfo.currentSlide = sliderInfo.prevSlide();
      multiSlider(sliderInfo, "prev");
      startAutoplay();
    });
  }
}
let resetTimeout;
function multiSlider(sliderInfo, direction) {
  clearTimeout(resetTimeout);

  let slides = sliderInfo.slides;
  let active = sliderInfo.currentSlide;
  let prev = sliderInfo.prevSlide();
  let next = sliderInfo.nextSlide();

  if (slides.length > 1) {
    Array.from(slides).forEach((slide) => {
      slide.classList.remove("active", "animation-in", "animation-out", "animation-leftOut");
    });

    if (direction === "next") {
      slides[active].classList.add("active", "animation-in");
      slides[prev].classList.add("animation-out");
      slides[prev].style.transition = sliderInfo.animationTime + "ms cubic-bezier(0.165, 0.84, 0.44, 1) opacity";
      slides[prev].style.opacity = 1;
    } else if (direction === "prev") {
      slides[active].classList.add("active", "ab-fadeInLeft");
      slides[next].classList.add("ab-fadeInLeft", "animation-leftOut");
      slides[next].style.opacity = 1;
    }

    [slides[active], slides[prev], slides[next]].forEach((slide) => {
      if (slide) slide.style.animationDuration = `${sliderInfo.animationTime}ms`;
    });

    resetTimeout = setTimeout(() => {
      slides[prev]?.classList.remove("ab-fadeInLeft", "active");
      slides[prev]?.classList.remove("animation-out", "active");
      slides[next]?.classList.remove("animation-out", "active");
      slides[next]?.classList.remove("animation-leftOut", "active");
    }, sliderInfo.animationTime - 100);
  }
}
function slider(sliderInfo) {
  if (!document.getElementById("announcement-bar-with-slider")) {
    removeAnnouncement();
  } else {
    let slides = sliderInfo.slides;
    let active = sliderInfo.currentSlide;
    let prev = sliderInfo.prevSlide();
    if (slides[active] && slides[prev]) {
      slides[active].classList.add("active", abApiSetting.animationIn, "animation-in");
      slides[active].style.animationDuration = abApiSetting.animationTime + "ms";
      slides[active].style.transition = abApiSetting.animationTime + "ms opacity";
      slides[prev].classList.remove("active");
      slides[prev].classList.add(abApiSetting.animationOut, "animation-out");
      slides[prev].style.animationDuration = abApiSetting.animationTime + "ms";
      slides[prev].style.transition = abApiSetting.animationTime + "ms opacity";

      animationIn = setTimeout(() => {
        if (slides[active]) {
          slides[active].classList.remove(abApiSetting.animationIn, "animation-in");
        }
      }, abApiSetting.animationTime - 100);

      animationOut = setTimeout(() => {
        if (slides[prev]) {
          slides[prev].classList.remove(abApiSetting.animationOut, "animation-out");
        }
      }, abApiSetting.animationTime);
    }
  }
}
function handleslidesizings() {
  let ab = document.querySelectorAll(".announcement-bar-with-slider");
  if (!stopDuplication) {
    cloneSlides();
  }
  addMarqueeCss();
}

function httpGetAsync(theUrl, callback) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

function managePositionOfHeader() {
  let element = document.querySelector(".ab-fix-position");
  fixedElementSelect = getElementByStyle(element, "position", "fixed");
  if (!fixedElementSelectSetTop) {
    if (fixedElementSelect.style) {
      fixedElementSelectTop = fixedElementSelect.style.top;
    }
  }
  if (fixedElementSelect) {
    if (abApiSetting.slidePosition == "fixed") {
      fixedElementSelect.style.top = abApiSetting.slideHeight + "px";
    } else {
      fixedElementSelect.style.top =
        abApiSetting.slideHeight - window.pageYOffset > 0
          ? abApiSetting.slideHeight - window.pageYOffset + "px"
          : 0 + "px";
    }
  }
  fixedElementSelectSetTop = true;
}

export function removeAnnouncement() {
  let abSlideLinkEles = document.querySelectorAll("#announcement-bar-with-slider .ab-slide-link");
  if (abSlideLinkEles) {
    for (let i = 0; i < abSlideLinkEles.length; i++) {
      let abSlideLinkEle = abSlideLinkEles[i];
      abSlideLinkEle.removeAttribute("href");
    }
  }
  window.removeEventListener("scroll", managePositionOfHeader, true);
  if (removeInterval) {
    clearInterval(removeInterval);
  }
  clearInterval(removeTimeout);
  clearInterval(animationIn);
  clearInterval(animationOut);

  if (document.getElementById("announcement-bar-with-slider")) {
    let announcement = document.getElementById("announcement-bar-with-slider");
    let abFixElement = document.getElementById("ab-fix-element");
    if (abFixElement) {
      abFixElement.remove();
    }
    announcement.remove();

    if (fixedElementSelect) {
      fixedElementSelect.style.top = fixedElementSelectTop;
    }
  }
  // setCookie("ab-bar", "true", 5);
}

function getElementByStyle(element, el, val) {
  let elems = [];
  elems = element.getElementsByTagName("*");
  if (window.getComputedStyle(element, null).getPropertyValue(el) == val) {
    return element;
  }
  for (let i = 0; i < elems.length; i++) {
    if (window.getComputedStyle(elems[i], null).getPropertyValue(el) == val) {
      return elems[i];
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// added for horizontal sliding
function initialSlides() {
  announceElement = document.querySelector(".announcement-bar-with-slider");
  bodyWidth = document.querySelector("body").offsetWidth;
  totalSlideWidth = 0;
  count = 1;
  let horizontalSliders = announceElement?.querySelectorAll(".horizontal-slider") || [];
  for (let i = 0; i < horizontalSliders.length; i++) {
    let horizontalSlider = horizontalSliders[i];
    totalSlideWidth = totalSlideWidth + horizontalSlider.offsetWidth;
    if (i == horizontalSliders.length - 1) {
      if (totalSlideWidth == 0) {
        stopDuplication = true;
      }
    }
  }
}
function availableSlides() {
  let result = 0;
  let horizontalSliders = announceElement.querySelectorAll(".horizontal-slider");
  for (let i = 0; i < horizontalSliders.length; i++) {
    let horizontalSlider = horizontalSliders[i];
    result = result + horizontalSlider.offsetWidth;
  }
  return result;
}
function cloneSlides() {
  if (availableSlides() < bodyWidth + totalSlideWidth) {
    count++;
    duplicateChildNodes("horizontal-slider-wrapper");
    cloneSlides();
  }
}
function duplicateChildNodes(parentId) {
  var parent = document.getElementById(parentId);
  // var item = parent.querySelector(".horizontal-slider:not(.cloned)");
  let cloneElement = document.createElement("div");
  cloneElement.classList.add("horizontal-slider");
  cloneElement.classList.add("cloned");
  // var cln = item.cloneNode(true);
  // cln.classList.add("cloned");
  // parent.appendChild(cln);
  for (let i = 0; i < tmpArrForHorizontalSlides.length; i++) {
    let element = tmpArrForHorizontalSlides[i];
    cloneElement.appendChild(generateHtmlForslide(element.slide, element.index, element.slideHeight));
  }
  parent.appendChild(cloneElement);
}
function getPercent(count) {
  let tmpSlides = availableSlides();
  let transformWidth = tmpSlides / count;
  return parseFloat((transformWidth * 100) / tmpSlides).toFixed(2) + "%";
}
function addMarqueeCss() {
  let tmpWidth = availableSlides().toString() + "px !important";
  let animationTimeInSeconds = abApiSetting.textAnimationTime + "s";

  // if (abApiSetting.timePerPixel) {
  animationTimeInSeconds = (totalSlideWidth / setAvgPx()).toString() + "s";
  // }

  let css =
    `@keyframes marquee {
        0% {
            transform: translateX(0);
        }
    
        100% {
            transform: translateX(-` +
    getPercent(count) +
    `);
        }
    }
    .marquee__content {
        animation-duration: ` +
    animationTimeInSeconds +
    `;
    }
    .ab-slider .horizontal-slider-wrapper.marquee__content {
        width:` +
    tmpWidth +
    ` 
    }
    `;

  let style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}
function setAvgPx() {
  let tmpSingleSliderWidth = 0;
  const box = document.querySelector(".horizontal-slider");
  if (box) {
    tmpSingleSliderWidth = box.offsetWidth;
    const tmpPxPerSec = tmpSingleSliderWidth / abApiSetting.textAnimationTime;
    return tmpPxPerSec;
  }
}

function addStylesheetURL(url) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}

function replaceString(str) {
  return str.replaceAll(" ", "+");
}
