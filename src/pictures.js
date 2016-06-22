'use strict';



// Прячем блок с фильтрами
var filterBlock = document.getElementsByClassName('filters');
filterBlock[0].classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');
console.log(picturesContainer);

var templateElement = document.querySelector('template');
console.log(templateElement);
console.log(window.pictures);

var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;


  var galleryImage = new Image();
  galleryImage.onload = function(evt) {
    element.querySelector('img').url = '\'' + evt.target.src + '\'';
  };
  galleryImage.src = data.url;

  container.appendChild(element);


  return element;
};

window.pictures.forEach(function(picture) {
  getPictureElement(picture, picturesContainer);
});
