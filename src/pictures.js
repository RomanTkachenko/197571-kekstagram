'use strict';

// Прячем блок с фильтрами
var filterBlock = document.querySelector('.filters');
filterBlock.classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');

var templateElement = document.getElementById('picture-template');

var elementToClone;

/** @constant {string} */
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}
var pictures = [];

var filteredPictures = [];

var IMAGE_LOAD_TIMEOUT = 10000;
var DAYS_SINCE_PICTURE_LOAD = 4;

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
    if (this.readyState !== 3) {
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
  picturesContainer.classList.add('pictures-loading');
};

var isBottomReached = function() {
  var GAP = 100;
  var bodyElement = document.querySelector('body');
  var bodyPosition = bodyElement.getBoundingClientRect();
  return bodyPosition.bottom - window.innerHeight - GAP <= 0;
};

var isNextPageAvailible = function(picturesToRender, page) {
  return page < Math.ceil(picturesToRender.length / PAGE_SIZE);
};

var PAGE_SIZE = 12;
var pageNumber = 0;


/** @param {Array.<Object>} pictures */
var renderPictures = function(picturesToRender, page) {
  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var container = document.createDocumentFragment();
  picturesToRender.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, container);
  });
  picturesContainer.appendChild(container);
};

var renderNextPages = function(reset) {
  if(reset) {
    pageNumber = 0;
    picturesContainer.innerHTML = '';
  }
  while(isBottomReached() &&
    isNextPageAvailible(filteredPictures, pageNumber, PAGE_SIZE)) {
    renderPictures(filteredPictures, pageNumber);
    pageNumber++;
  }
};


var DEFAULT_FILTER = 'filter-popular';
getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFilterName(true);
  setFilterEnabled(DEFAULT_FILTER);
  setScrollEnabled();
});

filterBlock.classList.remove('hidden');

var Filter = {
  POPULARITY: 'filter-popular',
  NEWEST: 'filter-new',
  DISCUSSED: 'filter-discussed'
};

var setFilterName = function() {
  filterBlock.addEventListener('click', function(evt) {
    if(evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });
};

var setFilterEnabled = function(filter) {
  filteredPictures = getFilteredPictures(filter);
  renderNextPages(true);

};

var getFilteredPictures = function(filter) {
  var picturesToFilter = pictures.slice(0);
  var filterNewPhotoMessage = document.querySelector('.filter-new-error');

  switch(filter) {
    case Filter.POPULARITY:
      picturesToFilter.sort(function(a, b) {
        return b.likes - a.likes;
      });
      filterNewPhotoMessage.classList.add('hidden');
      break;

    case Filter.NEWEST:
      picturesToFilter = picturesToFilter.filter(function(creature) {
        return (new Date() - new Date(creature.date)) < (DAYS_SINCE_PICTURE_LOAD * 24 * 60 * 60 * 1000);
      }).sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      if(picturesToFilter.length === 0) {
        filterNewPhotoMessage.classList.remove('hidden');
      }
      break;

    case Filter.DISCUSSED:
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      filterNewPhotoMessage.classList.add('hidden');
      break;
  }
  return picturesToFilter;
};

var THROTTLE_DELAY = 100;

var setScrollEnabled = function() {
  var lastCall = Date.now();
  window.addEventListener('scroll', function() {
    if(Date.now() - lastCall >= THROTTLE_DELAY) {
      renderNextPages();
      lastCall = Date.now();
    }
  });
};
