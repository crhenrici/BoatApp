import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { BoatService } from '../boat.service';
import { Boat } from '../model/boat';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BoatDialogComponent } from '../boat-dialog/boat-dialog.component';
import { merge, startWith, switchMap, map, catchError, of as observableOf } from 'rxjs';

const DATA: Boat[] = [
  { id: 1, name: "Boat A", description: "Some very cool boat" },
  { id: 2, name: "Boat B", description: "Some cool boat" },
  { id: 3, name: "Boat C", description: "Some other boat" },
]

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatTableModule, RouterLink, MatButtonModule, MatPaginatorModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  displayedColumns: string[] = ['action', 'id', 'name', 'desc'];
  dataSource: MatTableDataSource<Boat> = new MatTableDataSource<Boat>([]);
  totalItems = 0
  isLoading = false;
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private boatService: BoatService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          console.log('pageIndex: ', this.paginator.pageIndex, ', pageSize: ', this.paginator.pageSize)
          return this.boatService.findAll(this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(response => {
          this.isLoading = false;
          this.totalItems = response.totalCount;
          return response.data;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        console.log('data: ', JSON.stringify(data));
        this.dataSource.data = data;
      });
  }

  onDelete(id: string) {
    this.boatService.delete(id).subscribe(() => this.dataSource.data = this.dataSource.data.filter(boat => boat.id !== Number(id)));
  }

  openDialog() {
    const dialogRef = this.dialog.open(BoatDialogComponent, {
      data: { name: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result: ', JSON.stringify(result))
      if (result) {
        this.boatService.create(result as Boat).subscribe((res) => {
          this.dataSource.data = [...this.dataSource.data, res];
        });
      }
    })
  }
}
