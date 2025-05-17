import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { PromotionService } from '../promotion.service';
import { switchMap } from 'rxjs';
import { formatDate } from '@angular/common';
import { Promotion } from '../models';


@Component({
  selector: 'app-promotion-create',
  templateUrl: './promotion-create.component.html',
  styleUrl: './promotion-create.component.scss'
})
export class PromotionCreateComponent implements OnInit {

  promotionForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);
  private promotionService = inject(PromotionService);


  ngOnInit(): void {
    this.initForm();

    if (!this.router.url.includes('edit')) return;

    this.activateRoute.params
      .pipe(switchMap(({ id }) => this.promotionService.getPromotionById(id))
      ).subscribe(promotion => {
        if (!promotion) return this.router.navigateByUrl('/dashboard/promotion/promotions');

        //Fix - Desfase en las fechas
        this.promotionForm.reset({
          ...promotion,
          start_date: new Date(promotion.start_date + ' 0:00:00'),
          end_date: new Date(promotion.end_date + ' 0:00:00'),
          status: promotion.status == 'Activa' ? true : false
        });

        return;
      });
  }


  private initForm() {
    this.promotionForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      price: ['', Validators.required],
      duration_months: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  get currentPromotion(): Promotion {
    const promotion = this.promotionForm.value as Promotion;
    return promotion;
  }



  goPromotions() {
    this.router.navigate(['/dashboard/promotion/promotions']);
  }

  enviarDatos() {

    if (this.promotionForm.invalid) return;

    if (this.currentPromotion.id) {
      //Actualizar
      this.promotionService.updatePromotion(this.promotionForm.value)
        .subscribe({
          next: (response) => {
            this.snackbarService.showSuccess(response);
            this.router.navigate(['/dashboard/promotion/promotions']);
          },
          error: (err) => {
            this.snackbarService.showError(err);
          }
        })
      return;

    }

    //Creamos una promoción
    this.promotionService.addPromotion(this.promotionForm.value).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response);
        this.router.navigate(['/dashboard/promotion/promotions']);
      },
      error: (err) => {
        this.snackbarService.showError(err);
      }
    })
  }



}
