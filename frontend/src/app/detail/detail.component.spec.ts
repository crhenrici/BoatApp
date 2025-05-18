import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComponent } from './detail.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BoatService } from '../boat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Boat } from '../model/boat';


const mockBoat: Boat = { id: 1, name: 'Boat A', description: 'Some boat'};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let boatServiceSpy: jasmine.SpyObj<BoatService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    boatServiceSpy = jasmine.createSpyObj('BoatService', ['getById', 'update']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DetailComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        { provide: BoatService, useValue: boatServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1'}}}},
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should fetch boat by id on init when input is null', () => {
    boatServiceSpy.getById.and.returnValue(of(mockBoat));
    component.boat = null
    fixture.detectChanges();

    expect(boatServiceSpy.getById).toHaveBeenCalledWith('1');
    expect(component.boat!).toEqual(mockBoat);
    expect(component.boatUpdate).toEqual(mockBoat);
  });

  it('shoul not fetch boat if input is already provided', () => {
    component.boat = mockBoat;
    fixture.detectChanges();

    expect(boatServiceSpy.getById).not.toHaveBeenCalled();
  });

  it('should enable edit mode when edit button is clicked', () => {
    component.isEdit = false; 
    boatServiceSpy.getById.and.returnValue(of(mockBoat));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('#edit');
    expect(button).not.toBeNull();

    button.click();
    fixture.detectChanges();
    expect(component.isEdit).toBeTrue();
  });

  it('should save a boat and exit edit mode', () => {
    component.boat = {...mockBoat};
    boatServiceSpy.update.and.returnValue(of({...mockBoat, name: 'Updated boat'}));
    component.onSave();
    expect(boatServiceSpy.update).toHaveBeenCalledWith(mockBoat);
    expect(component.boat.name).toBe('Updated boat');
    expect(component.isEdit).toBeFalse();
    expect(component.boatUpdate?.name).toBe('Updated boat');
  });

  it('should cancel editing and reset boat data', () => {
    component.boatUpdate = {...mockBoat};
    component.boat = {...mockBoat, name: 'Updated boat'};
    component.isEdit = true;
    component.onCancel({} as any);
    expect(component.boat).toEqual(mockBoat);
    expect(component.isEdit).toBeFalse();
  });

  it('should navigate back if history length > 1', () => {
    spyOnProperty(window, 'history').and.returnValue({ length: 2} as any);
    component.onBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should navigate to /home if no history', () => {
    spyOnProperty(window, 'history').and.returnValue({length: 1} as any);
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  })
});
