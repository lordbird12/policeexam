import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idCardFormat'
})
export class IdCardFormatPipe implements PipeTransform {
  transform(value: string): string {
    // ตรวจสอบว่าความยาวของเลขบัตรประชาชนถูกต้อง
    if (value.length !== 13) {
      return value; // ไม่มีการเปลี่ยนแปลง
    }

    // จัดรูปแบบเลขบัตรประชาชนให้เป็น X-XXXX-XXXXX-XX-X
    return `${value.substr(0, 1)}-${value.substr(1, 4)}-${value.substr(5, 5)}-${value.substr(10, 2)}-${value.substr(12, 1)}`;
  }
}
