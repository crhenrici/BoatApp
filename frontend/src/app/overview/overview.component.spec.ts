import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { Boat } from '../model/boat';
import { BoatService } from '../boat.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';
import { provideRouter, Routes } from '@angular/router';
import { Component } from '@angular/core';

const DATA: Boat[] = [
  {id: 1, name: 'Boat A', description: 'Some boat'},
  {id: 2, name: 'Boat B', description: 'Some other boat'},
  {id: 3, name: 'Boat C', description: 'Some cool boat'}
];

@Component({template: ''})
class DummyComponent {}

const routes: Routes = [
  { path: '/boat/:id', component: DummyComponent }
]

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let boatServiceSpy: jasmine.SpyObj<BoatService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>

  beforeEach(async () => {
    boatServiceSpy = jasmine.createSpyObj('BoatService', ['findAll', 'delete', 'create']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        OverviewComponent,
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSnackBarModule
      ],
      providers: [
        provideRouter(routes),
        { provide: BoatService, useValue: boatServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    component.paginator = {
      pageIndex: 0,
      pageSize: 5,
      page: of({})
    } as unknown as MatPaginator;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load boats on init', fakeAsync(() => {
    const mockResponse = {
      data: DATA,
      totalCount: 3
    };

    boatServiceSpy.findAll.and.returnValue(of(mockResponse));
    component.ngAfterViewInit();
    tick();
    expect(component.dataSource).toEqual(DATA);
    expect(component.totalItems).toBe(3);
  }));

  it('should fallback to empty array on loadPage error', fakeAsync(() => {
    boatServiceSpy.findAll.and.returnValue(throwError(() => 'Error'));
    component.ngAfterViewInit();
    tick();

    expect(component.dataSource).toEqual([]);
    expect(component.isLoading).toBeFalse();
  }));

  it('should call delete and reload page', fakeAsync(() => {
    const mockResponse = {
      data: DATA,
      totalCount: 3
    };

    boatServiceSpy.delete.and.returnValue(of({}));
    boatServiceSpy.findAll.and.returnValue(of(mockResponse));

    component.dataSource = [... DATA];
    component.paginator = { pageIndex: 0, pageSize: 5} as MatPaginator;

    component.onDelete('1');
    tick();

    expect(boatServiceSpy.delete).toHaveBeenCalledWith('1');
    expect(boatServiceSpy.findAll).toHaveBeenCalled();
  }));

  it('should decrement pageIndex if last item and not on first page', fakeAsync(() => {
    component.dataSource = [DATA[0]];
    component.paginator = { pageIndex: 1, pageSize: 5 } as MatPaginator;

    boatServiceSpy.delete.and.returnValue(of({}));
    spyOn<any>(component, 'loadPage');

    component.onDelete('1');
    tick();

    expect(component.paginator.pageIndex).toBe(0);
  }));

  it('should create a boat when dialog is closed with results', fakeAsync(() => {
    const newBoat: Boat = { id: 4, name: 'Boat D', description: 'Some Boat'};
    boatServiceSpy.create.and.returnValue(of(newBoat));
    boatServiceSpy.findAll.and.returnValue(of({data: [...DATA, newBoat], totalCount: 4}));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ name: 'Boat D', description: 'Some Boat'})
    } as any);

    component.paginator = { pageIndex: 0, pageSize: 5 } as MatPaginator;
    component.openDialog();
    tick();

    expect(component.paginator.pageIndex).toBe(0);
    expect(boatServiceSpy.create).toHaveBeenCalled();
  }));

  it('should show error if create fails', fakeAsync(() => {
    spyOn(component as any, 'showError');
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ name: 'Fail boat', description: 'something'})
    } as any);

    boatServiceSpy.create.and.returnValue(throwError(() => 'Create failed'));

    component.openDialog();
    tick();

    expect((component as any).showError).toHaveBeenCalledWith('Create failed');
  }));
});
