import { Component, Input } from '@angular/core';
import { Boat } from '../model/boat';
import { BoatService } from '../boat.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detail',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, CommonModule, MatButtonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {

  @Input()
  boat: Boat | null = null
  isEdit = false

  constructor(private boatService: BoatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.boat == null)  {
      const id = this.route.snapshot.paramMap.get('id');
      this.boatService.getById(id!).subscribe(res => this.boat = res);
    }
  }

  onSave() {
    this.boatService.update(this.boat!).subscribe(res => {
      res = this.boat = res;
      this.isEdit = false;
    });
  }

}
