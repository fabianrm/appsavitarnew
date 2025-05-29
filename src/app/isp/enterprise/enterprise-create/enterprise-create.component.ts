import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City } from '../../city/Models/CityResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { EnterpriseService } from '../enterprise.service';
import { Enterprise } from '../models';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CityService } from '../../city/city.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-enterprise-create',
    templateUrl: './enterprise-create.component.html',
    styleUrl: './enterprise-create.component.scss',
    standalone: false
})
export class EnterpriseCreateComponent {

    enterpriseForm!: FormGroup;
    cities: City[] = [];
    selectedFile: File | null = null;
    currentStoreImage: string = ''; // Ruta de la imagen actual
    status: boolean = true;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private activateRoute = inject(ActivatedRoute);
    private enterpriseService = inject(EnterpriseService);
    private cityService = inject(CityService);
    private snackbarService = inject(SnackbarService);


    ngOnInit() {
        this.initForm();
        this.getCities();

        if (!this.router.url.includes('edit')) return;

        this.activateRoute.params
            .pipe(switchMap(({ id }) => this.enterpriseService.getEnterpriseByID(id)))
            .subscribe((enterprise) => {
                console.log(enterprise);

                if (!enterprise)
                    return this.router.navigateByUrl('/dashboard/enterprise/enterprise-list');
                this.enterpriseForm.reset(enterprise);
                this.enterpriseForm.patchValue(
                    {
                        'cityId': enterprise.city.id,
                    },
                )
                return;
            });
    }


    get currentEnterprise(): Enterprise {
        const enterprise = this.enterpriseForm.value as Enterprise;
        return enterprise;
    }

    getCities() {
        this.cityService.getCities().subscribe((cities) => {
            if (cities.data.length > 0) {
                this.cities = cities.data;
            }
        });
    }

    private initForm() {
        this.enterpriseForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.minLength(3)]],
            ruc: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            cityId: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            logo: ['',],
            status: [this.status]
        });
    }

    // Activa el selector de archivos
    selectImage(): void {
        this.fileInput.nativeElement.click(); // Simula el clic en el input
    }


    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            // Actualiza la previsualización de la imagen en el formulario
            reader.onload = () => {
                this.enterpriseForm.patchValue({ logo: reader.result as string });
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    onSubmit() {
        if (this.enterpriseForm.invalid) return;
        if (this.currentEnterprise.id) {
            this.enterpriseService.updateEnterprise(this.enterpriseForm.value, this.selectedFile)
                .subscribe({
                    next: () => {
                        this.showSuccess();
                        this.router.navigateByUrl('/dashboard/enterprise/list')
                    },
                    error: (error) => {
                        Swal.fire('Error ☹️', error.message, 'error')
                    }
                })
            return;
        }
        //Creamos un producto
        if (this.enterpriseForm.valid) {
            this.enterpriseService.addEnterprise(this.enterpriseForm.value, this.selectedFile)
                .subscribe({
                    next: () => {
                        this.showSuccess();
                        this.router.navigateByUrl('/dashboard/enterprise/list')
                    },
                    error: (error) => {
                        Swal.fire('Error ☹️', error.message, 'error')
                    }
                });
        }
    }

    onSlideToggleChange(event: any) {
        this.status = event.checked; // Actualiza el valor de status con el nuevo estado del slide-toggle
    }


    onCancel() {
        this.router.navigateByUrl('/dashboard/enterprise/list');
    }

    showError() {
        this.snackbarService.showError('☹️ Ocurrió un error inesperado');
    }

    showSuccess() {
        this.snackbarService.showSuccess('Datos registrados correctamente');
    }

}
