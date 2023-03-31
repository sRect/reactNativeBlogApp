class Gps {
  //构造函数
  constructor(obj = {}) {
    let {longitude, latitude} = obj;
    if (longitude === undefined || latitude === undefined) {
      return console.error('经纬度参数不能为空!');
    }
    this.PI = 3.14159265358979324;
    return this.getCoordinate(longitude, latitude);
  }
  //纬度转换
  transformLatitude(x, y) {
    let num =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    num +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    num +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0;
    num +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
        320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0;
    return num;
  }
  //经度转换
  transformLongitude(x, y) {
    let num =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    num +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    num +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0;
    num +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
        300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0;
    return num;
  }
  // 坐标转换
  calculation(longitude, latitude) {
    let a = 6378245.0; // 卫星椭球坐标投影到平面地图坐标系的投影因子。
    let ee = 0.00669342162296594323; // 椭球的偏心率。
    let lat = this.transformLatitude(longitude - 105.0, latitude - 35.0);
    let lng = this.transformLongitude(longitude - 105.0, latitude - 35.0);
    let radLat = (latitude / 180.0) * this.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    lat = (lat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    lng = (lng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return {
      longitude: lng,
      latitude: lat,
    };
  }
  // 判断是否为国外坐标
  isOutOfChina(longitude, latitude) {
    if (longitude < 72.004 || longitude > 137.8347) {
      return true;
    }
    if (latitude < 0.8293 || latitude > 55.8271) {
      return true;
    }
    return false;
  }
  // GPS坐标 转 高德坐标
  getCoordinate(longitude, latitude) {
    longitude = Number(longitude);
    latitude = Number(latitude);
    if (this.isOutOfChina(longitude, latitude)) {
      //国外
      return {
        longitude: longitude,
        latitude: latitude,
      };
    } else {
      //国内
      let obj = this.calculation(longitude, latitude);
      return {
        longitude: longitude + obj.longitude,
        latitude: latitude + obj.latitude,
      };
    }
  }
}

export default Gps;
