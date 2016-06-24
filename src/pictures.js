'use strict';

// Прячем блок с фильтрами
var filterBlock = document.getElementsByClassName('filters');
filterBlock[0].classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');


var templateElement = document.querySelector('template');


var elementToClone;

/** @constant {string} */
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';


if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;


  var galleryImage = new Image();
  var galleryImageLoadTimeout;

  galleryImage.onload = function(evt) {
    clearTimeout(galleryImageLoadTimeout);
    element.querySelector('img').src = evt.target.src;
    element.querySelector('img').width = 182;
    element.querySelector('img').height = 182;

  };

  galleryImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  galleryImage.src = data.url;

  galleryImageLoadTimeout = setTimeout(function() {
    galleryImage.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  container.appendChild(element);

  return element;
};

/** @param {function(Array.<Object>)} callback */
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', PICTURES_LOAD_URL);

  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

//Прелоадер
  xhr.onreadystatechange = function() {
    if (this.readyState === 3) {
      picturesContainer.classList.add('pictures-loading');
    }else{
      picturesContainer.classList.remove('pictures-loading');
    }
  };

//Предупреждение об ошибке в случае неудачной загрузки
  var actErrorStatus = function() {
    picturesContainer.classList.add('pictures-failure');
  };
  xhr.onerror = actErrorStatus;
  xhr.timeout = 10000;
  xhr.ontimeout = actErrorStatus;

  xhr.send();
};

/** @param {Array.<Object>} hotels */
var renderPictures = function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

getPictures(function(loadedPictures) {
  var pictures = loadedPictures;
  renderPictures(pictures);
});

filterBlock[0].classList.remove('hidden');
