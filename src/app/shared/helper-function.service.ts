import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionService {

  constructor() { }
  
  
  //ใส่ datetime เข้ามา 2022-12-22T12:55:36
  showDateTime(strDateTime : any) {
    //แปลง string to date 
    let date_ob = new Date(strDateTime);
    if (!strDateTime || strDateTime == "NaN-NaN-NaN" || strDateTime == "1900-0-00") {
      return '';
    } else {
      let dtime = "";
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = ("0" + (date_ob.getHours())).slice(-2);
      let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
      let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
      dtime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
      return dtime;
    }
  }

  currentDateTime() {
    // datetime Now วันที่และเวลาปัจจุบัน
    var today = new Date();
    let dtime = "";
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = ("0" + (today.getHours())).slice(-2);
    let minutes = ("0" + (today.getMinutes())).slice(-2);
    let seconds = ("0" + (today.getSeconds())).slice(-2);
    dtime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return dtime;
  }

  nowDateString() {
    let today = new Date();
    let year = today.getFullYear();
    let dd = today.getDate();
    let ddStr = today.getDate().toString();
    let mm = today.getMonth() + 1; //มกราคม = 0!
    let mmStr = mm.toString();
    let result;
    if (dd < 10) {
      ddStr = '0' + dd;
    }
    if (mm < 10) {
      mmStr = '0' + mm;
    }
    result = year + "-" + mmStr + "-" + ddStr;
    return result;
  }

  dateSplitSlash(date : any) {
    if (!date|| date == "NaN-NaN-NaN" || date == "1900-0-00") {
      return '';
    } else {
      date = date.split(/[-/]+/).join("-");
      return date;
    }
  }

  /// แปลง format dd/mm/yyyy  >> yyyy-mm-dd
  reverseFormatDate(date : any) {
    if (!date || date == "NaN-NaN-NaN" || date == "1900-0-00") {
      return '';
    } else {
      date = date.split(/[-/]+/).reverse().join("-");
      return date;
    }
  }

  reverseDateSplitKed(date : any) {
    if (!date|| date == "NaN-NaN-NaN" || date == "1900-0-00") {
      return '';
    } else {
      date = date.split("-").reverse().join("/");
      return date;
    }
  }

  dateFormatSplitSlash(date: any) {
    date = date.split(/[-/]+/).join("-");
    return date;
  }

  dateFormatKed(date: any) {
    date = date.split('-').join("/");
    return date;
  }

}
