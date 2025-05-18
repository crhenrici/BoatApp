import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatDialogComponent } from './boat-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Boat } from '../model/boat';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';

describe('BoatDialogComponent', () => {
  let component: BoatDialogComponent;
  let fixture: ComponentFixture<BoatDialogComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<BoatDialogComponent>>;
  let okButton: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;
  let nameInput: HTMLInputElement;
  let descriptionInput: HTMLInputElement;

  const mockBoat: Boat = { id: 1, name: 'Boat A', description: 'Some boat'};

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
      BoatDialogComponent,
      FormsModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockBoat }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoatDialogComponent);
    nameInput = fixture.debugElement.query(By.css('#name')).nativeElement as HTMLInputElement;
    descriptionInput = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLInputElement;
    cancelButton = fixture.debugElement.query(By.css('#cancelbutton')).nativeElement as HTMLButtonElement;
    okButton = fixture.debugElement.query(By.css('#okbutton')).nativeElement as HTMLButtonElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable OK button if name or description is empty', () => {

    expect(okButton.disabled).toBeTrue();

    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(okButton.disabled).toBeTrue();

    nameInput.value = 'Boat name';
    nameInput.dispatchEvent(new Event('input'));
    descriptionInput.value = '';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(okButton.disabled).toBeTrue();
  });

  it('should call dialogRef.close when Cancel button clicked', () => {
    cancelButton.click();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('should return boat data on OK button clicked if form is valid', () => {
    nameInput.value = mockBoat.name;
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    descriptionInput.value = mockBoat.description;
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    okButton.click();
    fixture.detectChanges();
    
    expect(dialogSpy.close).toHaveBeenCalledWith(component.boat);
  });

});
