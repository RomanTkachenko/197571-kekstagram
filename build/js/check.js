function  getMessage (a, b){
var message;
  if (typeof a=="boolean") {
    if(a) {
    message="Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    }  else {
    message="Переданное GIF-изображение не анимировано";
    }
  }
  else if (typeof a=="number") {
    message="Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
  }
  else if (typeof a=="object"&&typeof b!=="object"){
    var sum=0;
    for(i=0; i<a.length;i++){
      sum=sum+a[i];
    }
    message="Количество красных точек во всех строчках изображения: "+sum;
  }
  else  if (typeof a=="object"&&typeof b=="object"){
    var square=0;
    for(i=0; i<a.length; i++){
      square=square+a[i]*b[i];
    }
    message="Общая площадь артефактов сжатия: "+square+" пикселей";
  }
return message;
}
