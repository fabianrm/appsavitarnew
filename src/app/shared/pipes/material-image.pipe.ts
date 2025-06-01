import { Pipe, PipeTransform } from '@angular/core';
import { Material } from '../../logistic/material/models/MaterialResponse';

@Pipe({
  name: 'materialImage',
  standalone: false
})
export class MaterialImagePipe implements PipeTransform {

  transform(material: Material): string {

    if (!material.id && !material.image)
      return 'assets/no-image.jpg';

    if (material.image) return material.image;
    return `assets/${material.id}.jpg`
  }

}
