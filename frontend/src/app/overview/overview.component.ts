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
  dataSource: Boat[] = [];
  totalItems = 0
  isLoading = false;
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private boatService: BoatService) { }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(startWith({}))
      .subscribe(() => this.loadPage());
  }

  private loadPage() {
    this.isLoading = true;
    this.boatService.findAll(this.paginator.pageIndex, this.paginator.pageSize)
    .pipe(
      map(response => {
        this.totalItems = response.totalCount;
        return response.data
      }),
      catchError(() => observableOf([]))
    )
    .subscribe(data => {
      this.isLoading = false;
      this.dataSource = data;
      this.paginator.length = this.totalItems
    })
  }

  onDelete(id: string) {
    this.boatService.delete(id).subscribe(() =>{
      if (this.dataSource.length == 1 && this.paginator.pageIndex > 0) {
        this.paginator.pageIndex--;
      }
      this.loadPage()
  });
  }

  openDialog() {
    const dialogRef = this.dialog.open(BoatDialogComponent, {
      data: { name: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boatService.create(result as Boat).subscribe((res) => {
          this.paginator.pageIndex = 0;
          this.loadPage()
        });
      }
    })
  }
}
