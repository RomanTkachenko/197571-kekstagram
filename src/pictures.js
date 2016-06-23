'use strict';

// Прячем блок с фильтрами
var filterBlock = document.getElementsByClassName('filters');
filterBlock[0].classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');
console.log(picturesContainer);

var templateElement = document.querySelector('template');
console.log(templateElement);

var elementToClone;

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
    console.log(element.querySelector('img').src);
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

window.pictures.forEach(function(picture) {
  getPictureElement(picture, picturesContainer);
});

filterBlock[0].classList.remove('hidden');
