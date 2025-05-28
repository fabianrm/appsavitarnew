import { Pipe, PipeTransform } from '@angular/core';
import { Enterprise } from '../../isp/enterprise/Models';


@Pipe({
  name: 'enterpriseImage',
  standalone: false
})
export class EnterpriseImagePipe implements PipeTransform {

  transform(enterprise: Enterprise): string {

    if (!enterprise.id && !enterprise.logo)
      return 'assets/no-image.jpg';

    if (enterprise.logo) return enterprise.logo;
    return `assets/${enterprise.id}.jpg`
  }

}
