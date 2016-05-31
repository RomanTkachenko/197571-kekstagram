function  getMessage (a, b){
var message;
switch (a) {
  case true: return message="Переданное GIF-изображение анимировано и содержит " + b + " кадров";
  break;
  case false: return message="Переданное GIF-изображение не анимировано";
    console.log("2");
  break;
}

if (typeof a=="number") {
  return message="Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
}

if (Array.isArray(a) && Array.isArray(b)==false){
  var sum=0;
  for(i=0; i<a.length; i++){
    sum=sum+a[i];
  }
  return message="Количество красных точек во всех строчках изображения: "+sum;
}

if (Array.isArray(a) && Array.isArray(b)){
  var square=0;
  for(i=0; i<a.length; i++){
    square=square+a[i]*b[i];
  }
  return message="Общая площадь артефактов сжатия: "+square+" пикселей";
}
}
