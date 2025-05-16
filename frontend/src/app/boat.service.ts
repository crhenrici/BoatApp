import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Boat } from './model/boat';
import { environment } from '../environments/environment';
import { PageObject } from './dto/PageObject';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
}
@Injectable({
  providedIn: 'root'
})
export class BoatService {
  private httpUrl: string;

  constructor(private http: HttpClient) {
    this.httpUrl = `${environment.apiUrl}/api/v1/boat`;
  }

  findAll(pageIndex: number, pageSize: number) {
    let params = new HttpParams();
    params = params.set("pageIndex", pageIndex.toString());
    params = params.set("pageSize", pageSize.toString());
    return this.http.get<PageObject>(this.httpUrl, {...httpOptions, params}).pipe(
      map(res => res as PageObject),
      catchError(this.handleError)
    )
  }

  getById(id: string) {
    const url = `${this.httpUrl}/${id}`;
    return this.http.get<Boat>(url, httpOptions).pipe(
      map(res => res as Boat),
      catchError(this.handleError)
    )
  }

  create(boat:Boat) {
    console.log('creating boat...');
    return this.http.post(this.httpUrl, {name: boat.name, description: boat.description}, httpOptions).pipe(
      map(res => res as Boat),
      catchError(this.handleError)
    );
  }

  update(boat: Boat) {
    const url = `${this.httpUrl}/${boat.id}`
    return this.http.put(url, {name: boat.name, description: boat.description}, httpOptions).pipe(
      map(res => res as Boat),
      catchError(this.handleError)
    );
  }

  delete(id: string) {
    const url = `${this.httpUrl}/${id}`;
    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    console.log(error)
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized';
    } else {
      errorMessage = `Server error: ${error.status}`;
    }


    return throwError(() => new Error(errorMessage));
  }
}
