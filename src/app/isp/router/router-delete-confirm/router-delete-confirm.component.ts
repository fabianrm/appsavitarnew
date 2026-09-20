import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterService } from '../router.service';
import { ReqRouter } from '../Models/ResponseRouter';

@Component({
  selector: 'app-router-delete-confirm',
  templateUrl: './router-delete-confirm.component.html',
  styleUrl: './router-delete-confirm.component.css',
  standalone: false,
})
export class RouterDeleteConfirmComponent {
  confirmText = '';
  deleting = false;
  error: string | null = null;
  script: string | null = null;
  copied = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public router: ReqRouter,
    private routerService: RouterService,
    private dialogRef: MatDialogRef<RouterDeleteConfirmComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }

  get hasVpn(): boolean {
    return !!this.router.wg_public_key;
  }

  get canConfirm(): boolean {
    return this.confirmText.trim() === this.router.ip && !this.deleting;
  }

  confirmDelete(): void {
    if (!this.canConfirm) return;

    this.deleting = true;
    this.error = null;

    this.routerService.deleteRouter(this.router.id).subscribe({
      next: (res) => {
        this.deleting = false;
        if (res.script) {
          this.script = res.script;
        } else {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.deleting = false;
        this.error = err?.error?.message ?? 'No se pudo eliminar el router.';
      },
    });
  }

  copyScript(): void {
    if (!this.script) return;
    navigator.clipboard.writeText(this.script).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 3000);
    });
  }

  close(): void {
    this.dialogRef.close(!!this.script);
  }
}
