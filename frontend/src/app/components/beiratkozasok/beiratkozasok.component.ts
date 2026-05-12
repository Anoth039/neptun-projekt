import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Beiratkozas, Hallgato, Kurzus } from '../../models/models';

@Component({
  selector: 'app-beiratkozasok',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-pencil-square me-2"></i>Beiratkozások kezelése</h2>

    <div class="card mb-4">
      <div class="card-header bg-primary text-white">Hallgató hozzárendelése kurzushoz</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-5">
            <select class="form-select" [(ngModel)]="ujBeiratkozas.hallgatoId">
              <option [ngValue]="0">– Hallgató választása –</option>
              <option *ngFor="let h of hallgatok" [value]="h.id">{{ h.nev }} ({{ h.tankor }})</option>
            </select>
          </div>
          <div class="col-md-5">
            <select class="form-select" [(ngModel)]="ujBeiratkozas.kurzusId">
              <option [ngValue]="0">– Kurzus választása –</option>
              <option *ngFor="let k of kurzusok" [value]="k.id">
                {{ k.tantargy?.nev }} – {{ k.kurzusKod }} ({{ k.felev }})
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" (click)="beiratkozas()">Hozzárendel</button>
          </div>
        </div>
        <div class="alert alert-danger mt-2" *ngIf="hiba">{{ hiba }}</div>
        <div class="alert alert-success mt-2" *ngIf="siker">{{ siker }}</div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr>
            <th>#</th><th>Hallgató</th><th>Tankör</th><th>Tantárgy</th><th>Kurzus</th><th>Félév</th><th>Érdemjegy</th><th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of beiratkozasok">
            <td>{{ b.id }}</td>
            <td>{{ b.hallgato?.nev }}</td>
            <td><span class="badge bg-secondary">{{ b.hallgato?.tankor }}</span></td>
            <td>{{ b.kurzus?.tantargy?.nev }}</td>
            <td>{{ b.kurzus?.kurzusKod }}</td>
            <td>{{ b.kurzus?.felev }}</td>
            <td>
              <span *ngIf="!jegyFelvetel[b.id!]">
                <span class="badge" [ngClass]="jegyBadge(b.jegy)">
                  {{ b.jegy ?? 'Nincs' }}
                </span>
                <button class="btn btn-sm btn-outline-secondary ms-1" (click)="jegyFelvetel[b.id!] = true">
                  <i class="bi bi-pencil"></i>
                </button>
              </span>
              <span *ngIf="jegyFelvetel[b.id!]" class="d-flex gap-1">
                <select class="form-select form-select-sm" style="width:80px" [(ngModel)]="jegyErtek[b.id!]">
                  <option [value]="1">1</option>
                  <option [value]="2">2</option>
                  <option [value]="3">3</option>
                  <option [value]="4">4</option>
                  <option [value]="5">5</option>
                </select>
                <button class="btn btn-sm btn-success" (click)="jegyMent(b)">✓</button>
                <button class="btn btn-sm btn-secondary" (click)="jegyFelvetel[b.id!] = false">✗</button>
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-danger" (click)="torol(b.id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class BeiratkozasokComponent implements OnInit {
  beiratkozasok: Beiratkozas[] = [];
  hallgatok: Hallgato[] = [];
  kurzusok: Kurzus[] = [];
  ujBeiratkozas = { hallgatoId: 0, kurzusId: 0 };
  jegyFelvetel: { [id: number]: boolean } = {};
  jegyErtek: { [id: number]: number } = {};
  hiba = '';
  siker = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.betolt();
    this.api.getHallgatok().subscribe((h) => {
      this.hallgatok = h;
      this.cdr.detectChanges();
    });
    this.api.getKurzusok().subscribe((k) => {
      this.kurzusok = k;
      this.cdr.detectChanges();
    });
  }

  betolt(): void {
    this.api.getBeiratkozasok().subscribe((lista) => {
      this.beiratkozasok = lista;
      this.cdr.detectChanges();
    });
  }

  beiratkozas(): void {
    this.hiba = '';
    this.siker = '';
    if (!this.ujBeiratkozas.hallgatoId || !this.ujBeiratkozas.kurzusId) {
      this.hiba = 'Hallgatót és kurzust is ki kell választani.';
      return;
    }
    this.api.addBeiratkozas(this.ujBeiratkozas).subscribe({
      next: () => {
        this.siker = 'Sikeres beiratkozás!';
        this.betolt();
        this.ujBeiratkozas = { hallgatoId: 0, kurzusId: 0 };
        setTimeout(() => {
          this.siker = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.hiba = err.error?.message || 'Beiratkozási hiba.';
        this.cdr.detectChanges();
      },
    });
  }

  jegyMent(b: Beiratkozas): void {
    const jegy = Number(this.jegyErtek[b.id!]);
    this.api.setJegy(b.id!, jegy).subscribe(() => {
      this.jegyFelvetel[b.id!] = false;
      this.betolt();
    });
  }

  torol(id: number): void {
    if (confirm('Biztosan törli a beiratkozást?')) {
      this.api.deleteBeiratkozas(id).subscribe(() => this.betolt());
    }
  }

  jegyBadge(jegy: number | null | undefined): string {
    if (!jegy) return 'bg-secondary';
    if (jegy === 5) return 'bg-success';
    if (jegy === 4) return 'bg-primary';
    if (jegy === 3) return 'bg-info text-dark';
    if (jegy === 2) return 'bg-warning text-dark';
    return 'bg-danger';
  }
}
