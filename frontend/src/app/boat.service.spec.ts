import { TestBed } from '@angular/core/testing';

import { BoatService } from './boat.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../environments/environment';
import { PageObject } from './dto/PageObject';
import { provideHttpClient } from '@angular/common/http';
import { Boat } from './model/boat';

describe('BoatService', () => {
  let service: BoatService;
  let httpMock: HttpTestingController

  const apiUrl = `${environment.apiUrl}/api/v1/boat`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        BoatService
      ]
    });
    service = TestBed.inject(BoatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch paged boats with findAll()', () => {
    const mockPage: PageObject = {
      data: [{ id: 1, name: 'Boat A', description: 'Some Boat'}, {id: 2, name: 'Boat B', description: 'Some other Boat'}],
      totalCount: 2
    };

    service.findAll(0, 5).subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpMock.expectOne(req => 
      req.url === apiUrl &&
      req.params.get('pageIndex') === '0' &&
      req.params.get('pageSize') === '5'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockPage);
  });

  it('should get boat by id', () => {
    const mockBoat: Boat = { id: 1, name: 'Boat A', description: 'Some Boat'};

    service.getById('1').subscribe(boat => {
      expect(boat).toEqual(mockBoat);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockBoat);
  });

  it('should create a boat', () => {
    const newBoat = { name: 'Boat A', description: 'Some Boat'};
    const createdBoat: Boat = { id: 1, name: newBoat.name, description: newBoat.description };

    service.create(newBoat as Boat).subscribe(boat => {
      expect(boat).toEqual(createdBoat);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    
    req.flush(createdBoat);
  });

  it('should update a boat', () => {
    const updatedBoat: Boat = {id: 2, name: 'Boat B', description: 'Some other boat'};

    service.update(updatedBoat).subscribe(boat => {
      expect(boat).toEqual(updatedBoat);
    });

    const req = httpMock.expectOne(`${apiUrl}/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(updatedBoat);
  });
  
  it('should delete a boat', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeNull();
    })

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(null);
  });

  it('should handle client error', () => {
    service.getById('1').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Client-side error: Invalid boat ID');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush({message: 'Invalid boat ID'}, {status: 400, statusText: 'Bad request'});
  });

  it('should handle unauthorized error', () => {
    service.getById('1').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush({}, { status: 401, statusText: 'Unauthorized'});
  });

  it('should handle server error', () => {
    service.getById('1').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Server error: 500');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush({}, { status: 500, statusText: 'Server error'});
  });
});
