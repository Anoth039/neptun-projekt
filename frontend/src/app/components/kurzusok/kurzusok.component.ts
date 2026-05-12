import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Kurzus, Tantargy } from '../../models/models';

@Component({
  selector: 'app-kurzusok',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-calendar3 me-2"></i>Kurzusok</h2>

    <div class="card mb-4" *ngIf="bejelentkezve">
      <div class="card-header">{{ szerkesztett ? 'Szerkesztés' : 'Új kurzus' }}</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="forma.tantargyId">
              <option [ngValue]="0">– Tantárgy –</option>
              <option *ngFor="let t of tantargyak" [value]="t.id">{{ t.nev }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <input class="form-control" placeholder="Kurzuskód (pl. EA1)" [(ngModel)]="forma.kurzusKod" />
          </div>
          <div class="col-md-2">
            <input class="form-control" placeholder="Félév (pl. 2024/25/2)" [(ngModel)]="forma.felev" />
          </div>
          <div class="col-md-2">
            <input class="form-control" type="number" placeholder="Max létszám" [(ngModel)]="forma.maxLetszam" />
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100" (click)="mentes()">
              {{ szerkesztett ? 'Mentés' : 'Hozzáad' }}
            </button>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-2" *ngIf="szerkesztett" (click)="megse()">Mégsem</button>
      </div>
    </div>

    <div class="alert alert-info" *ngIf="!bejelentkezve">
      <i class="bi bi-info-circle me-1"></i>Módosításhoz bejelentkezés szükséges.
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr>
            <th>#</th><th>Tantárgy</th><th>Oktató</th><th>Kurzuskód</th><th>Félév</th><th>Max létszám</th><th *ngIf="bejelentkezve">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let k of kurzusok">
            <td>{{ k.id }}</td>
            <td>{{ k.tantargy?.nev }}</td>
            <td>{{ k.tantargy?.oktato?.nev ?? '–' }}</td>
            <td><span class="badge bg-primary">{{ k.kurzusKod }}</span></td>
            <td>{{ k.felev }}</td>
            <td>{{ k.maxLetszam }}</td>
            <td *ngIf="bejelentkezve">
              <button class="btn btn-sm btn-warning me-1" (click)="szerkeszt(k)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" (click)="torol(k.id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class KurzusokComponent implements OnInit {
  kurzusok: Kurzus[] = [];
  tantargyak: Tantargy[] = [];
  forma: Kurzus = { kurzusKod: '', felev: '', maxLetszam: 30, tantargyId: 0 };
  szerkesztett: Kurzus | null = null;
  bejelentkezve = false;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.bejelentkezve.subscribe((v) => (this.bejelentkezve = v));
    this.betolt();
    this.api.getTantargyak().subscribe((t) => {
      this.tantargyak = t;
      this.cdr.detectChanges();
    });
  }

  betolt(): void {
    this.api.getKurzusok().subscribe((lista) => {
      this.kurzusok = lista;
      this.cdr.detectChanges();
    });
  }

  mentes(): void {
    if (!this.forma.kurzusKod || !this.forma.felev || !this.forma.tantargyId) return;
    if (this.szerkesztett) {
      this.api.updateKurzus(this.szerkesztett.id!, this.forma).subscribe(() => {
        this.betolt();
        this.megse();
      });
    } else {
      this.api.addKurzus(this.forma).subscribe(() => {
        this.betolt();
        this.forma = { kurzusKod: '', felev: '', maxLetszam: 30, tantargyId: 0 };
      });
    }
  }

  szerkeszt(k: Kurzus): void {
    this.szerkesztett = k;
    this.forma = { kurzusKod: k.kurzusKod, felev: k.felev, maxLetszam: k.maxLetszam, tantargyId: k.tantargyId };
  }

  megse(): void {
    this.szerkesztett = null;
    this.forma = { kurzusKod: '', felev: '', maxLetszam: 30, tantargyId: 0 };
  }

  torol(id: number): void {
    if (confirm('Biztosan törli?')) {
      this.api.deleteKurzus(id).subscribe(() => this.betolt());
    }
  }
}
