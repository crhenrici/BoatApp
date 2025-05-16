import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Boat } from '../model/boat';

@Component({
  selector: 'app-boat-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './boat-dialog.component.html',
  styleUrl: './boat-dialog.component.css'
})
export class BoatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<BoatDialogComponent>);
  readonly data = inject<Boat>(MAT_DIALOG_DATA);

  boat: Boat = { ...this.data};

  onNoClick(): void {
    this.dialogRef.close();
  }
}
