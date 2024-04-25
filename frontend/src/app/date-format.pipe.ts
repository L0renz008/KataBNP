import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return ''; // Return empty string if value is falsy (e.g., null or undefined)
    }

    const dateObj = new Date(value); // Create a Date object from the input date string
    const day = dateObj.getDate().toString().padStart(2, '0'); // Get day of the month (zero-padded)
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based)
    const year = dateObj.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Format date as 'dd/MM/yyyy'
  }
}
