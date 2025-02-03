import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applyTemplate'
})
export class ApplyTemplatePipe implements PipeTransform {
  transform(template: string, apartment: any): string {
    if (!template || !apartment) return '';
    return template
      .replace('{id}', apartment.id || 'N/A')
      .replace('{title}', apartment.title || 'No title')
      .replace('{location_date}', apartment.location_date || 'N/A')
      .replace('{price}', apartment.price || 'N/A')
      .replace('{room}', apartment.room || 'N/A')
      .replace('{description}', apartment.description || 'No description')
      .replace('{url}', apartment.url || 'No URL');
  }
}
