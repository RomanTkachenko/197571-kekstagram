function  getMessage (a, b){
var message;
var typeOfA=typeof a;
switch (typeOfA) {
  case "boolean":
    if(a) {
      return message="Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else {
      return message="Переданное GIF-изображение не анимировано";
    }
  break;
  case "number": return message="Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
  break;
  case "object":
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
  break;
}
}
