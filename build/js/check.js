function  getMessage (a, b){
var typeOfA=typeof a;
switch (typeOfA) {
  case "boolean":
    if(a) {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else {
      return "Переданное GIF-изображение не анимировано";
    }
  break;
  case "number":
    return "Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
  break;
  case "object":
    if (Array.isArray(a) && Array.isArray(b)==false){
      var sum=0;
      for(i=0; i<a.length; i++){
        sum=sum+a[i];
      }
      return "Количество красных точек во всех строчках изображения: "+sum;
    }
    if (Array.isArray(a) && Array.isArray(b)){
      var square=0;
      for(i=0; i<a.length; i++){
        square=square+a[i]*b[i];
      }
      return "Общая площадь артефактов сжатия: "+square+" пикселей";
    }
  break;
}
}
