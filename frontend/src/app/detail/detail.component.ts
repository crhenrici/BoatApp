import { Component, Input } from '@angular/core';
import { Boat } from '../model/boat';
import { BoatService } from '../boat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, Location } from '@angular/common';
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
  boatUpdate: Boat | null = null
  isEdit = false

  constructor(private boatService: BoatService, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void {
    if (this.boat == null) {
      const id = this.route.snapshot.paramMap.get('id');
      this.boatService.getById(id!).subscribe(res => {
        this.boat = res
        this.boatUpdate = {...res};
      }
      );
    }
  }

  onSave() {
    this.boatService.update(this.boat!).subscribe(res => {
      this.boat = res;
      this.isEdit = false;
      this.boatUpdate = {...res};
    });
  }

  onBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  onCancel(form: NgForm) {
    console.log(`onCancel boatUpdate: ${JSON.stringify(this.boatUpdate)}`)
    this.boat = this.boatUpdate;
    // form.reset(this.boat);
    this.isEdit = false;
  }

}
