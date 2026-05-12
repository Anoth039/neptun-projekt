import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Tantargy, Oktato } from '../../models/models';

@Component({
  selector: 'app-tantargyak',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-book me-2"></i>Tantárgyak</h2>

    <div class="card mb-4" *ngIf="bejelentkezve">
      <div class="card-header">{{ szerkesztett ? 'Szerkesztés' : 'Új tantárgy' }}</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tantárgy neve" [(ngModel)]="forma.nev" />
          </div>
          <div class="col-md-2">
            <input class="form-control" type="number" placeholder="Kredit" [(ngModel)]="forma.kredit" min="1" max="10" />
          </div>
          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="forma.oktatoId">
              <option [ngValue]="undefined">– Oktató választása –</option>
              <option *ngFor="let o of oktatok" [value]="o.id">{{ o.nev }} ({{ o.tanszek }})</option>
            </select>
          </div>
          <div class="col-md-2">
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
            <th>#</th><th>Név</th><th>Kredit</th><th>Oktató</th><th>Tanszék</th><th>Kurzusok</th><th *ngIf="bejelentkezve">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of tantargyak">
            <td>{{ t.id }}</td>
            <td>{{ t.nev }}</td>
            <td><span class="badge bg-success">{{ t.kredit }} kr</span></td>
            <td>{{ t.oktato?.nev ?? '–' }}</td>
            <td>{{ t.oktato?.tanszek ?? '–' }}</td>
            <td><span class="badge bg-secondary">{{ t.kurzusok?.length || 0 }} kurzus</span></td>
            <td *ngIf="bejelentkezve">
              <button class="btn btn-sm btn-warning me-1" (click)="szerkeszt(t)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" (click)="torol(t.id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class TantargyakComponent implements OnInit {
  tantargyak: Tantargy[] = [];
  oktatok: Oktato[] = [];
  forma: Tantargy = { nev: '', kredit: 3, oktatoId: undefined };
  szerkesztett: Tantargy | null = null;
  bejelentkezve = false;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.bejelentkezve.subscribe((v) => (this.bejelentkezve = v));
    this.betolt();
    this.api.getOktatok().subscribe((o) => {
      this.oktatok = o;
      this.cdr.detectChanges();
    });
  }

  betolt(): void {
    this.api.getTantargyak().subscribe((lista) => {
      this.tantargyak = lista;
      this.cdr.detectChanges();
    });
  }

  mentes(): void {
    if (!this.forma.nev || !this.forma.kredit) return;
    if (this.szerkesztett) {
      this.api.updateTantargy(this.szerkesztett.id!, this.forma).subscribe(() => {
        this.betolt();
        this.megse();
      });
    } else {
      this.api.addTantargy(this.forma).subscribe(() => {
        this.betolt();
        this.forma = { nev: '', kredit: 3, oktatoId: undefined };
      });
    }
  }

  szerkeszt(t: Tantargy): void {
    this.szerkesztett = t;
    this.forma = { nev: t.nev, kredit: t.kredit, oktatoId: t.oktatoId };
  }

  megse(): void {
    this.szerkesztett = null;
    this.forma = { nev: '', kredit: 3, oktatoId: undefined };
  }

  torol(id: number): void {
    if (confirm('Biztosan törli?')) {
      this.api.deleteTantargy(id).subscribe(() => this.betolt());
    }
  }
}
