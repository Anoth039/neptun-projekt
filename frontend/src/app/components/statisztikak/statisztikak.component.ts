import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Hallgato } from '../../models/models';

@Component({
  selector: 'app-statisztikak',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-bar-chart me-2"></i>Statisztikák</h2>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0"><i class="bi bi-person me-2"></i>Hallgató átlaga</h5>
          </div>
          <div class="card-body">
            <select class="form-select mb-3" [(ngModel)]="kivalasztottHallgatoId" (change)="hallgatoAtlag()">
              <option [ngValue]="0">– Hallgató választása –</option>
              <option *ngFor="let h of hallgatok" [value]="h.id">{{ h.nev }} ({{ h.tankor }})</option>
            </select>
            <div *ngIf="hallgatoAtlagAdat" class="text-center p-3">
              <div class="display-4 fw-bold" [ngClass]="atlagSzin(hallgatoAtlagAdat.atlag)">
                {{ hallgatoAtlagAdat.atlag !== null ? (hallgatoAtlagAdat.atlag | number:'1.2-2') : '–' }}
              </div>
              <p class="text-muted">{{ hallgatoAtlagAdat.jegyek }} érdemjegy alapján</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0"><i class="bi bi-people me-2"></i>Tankör átlaga</h5>
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <input class="form-control me-2" placeholder="Tankör (pl. IB-0AB)" [(ngModel)]="tankorKereses" />
              <button class="btn btn-warning" (click)="tankorAtlag()">Lekérdez</button>
            </div>
            <div *ngIf="tankorAtlagAdat" class="text-center p-3">
              <div class="display-4 fw-bold" [ngClass]="atlagSzin(tankorAtlagAdat.atlag)">
                {{ tankorAtlagAdat.atlag !== null ? (tankorAtlagAdat.atlag | number:'1.2-2') : '–' }}
              </div>
              <p class="text-muted">
                {{ tankorAtlagAdat.hallgatokSzama }} hallgató,
                {{ tankorAtlagAdat.jegyekSzama }} érdemjegy alapján
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-4 shadow-sm">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0"><i class="bi bi-table me-2"></i>Tankörök összesítő</h5>
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr><th>Tankör</th><th>Hallgatók száma</th><th>Átlag</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tankorStatisztika">
              <td><span class="badge bg-secondary">{{ t.tankor }}</span></td>
              <td>{{ t.hallgatokSzama }}</td>
              <td>
                <span [ngClass]="atlagSzin(t.atlag)">
                  {{ t.atlag !== null ? (t.atlag | number:'1.2-2') : '–' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class StatisztikakComponent implements OnInit {
  hallgatok: Hallgato[] = [];
  kivalasztottHallgatoId = 0;
  hallgatoAtlagAdat: any = null;
  tankorKereses = '';
  tankorAtlagAdat: any = null;
  tankorStatisztika: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getHallgatok().subscribe((lista) => {
      this.hallgatok = lista;
      this.cdr.detectChanges();
      const tankorok = [...new Set(lista.map((h) => h.tankor))];
      tankorok.forEach((tankor) => {
        this.api.getTankorAtlag(tankor).subscribe((adat) => {
          this.tankorStatisztika.push(adat);
          this.tankorStatisztika.sort((a, b) => a.tankor.localeCompare(b.tankor));
          this.cdr.detectChanges();
        });
      });
    });
  }

  hallgatoAtlag(): void {
    if (!this.kivalasztottHallgatoId) return;
    this.api.getHallgatoAtlag(this.kivalasztottHallgatoId).subscribe((a) => {
      this.hallgatoAtlagAdat = a;
      this.cdr.detectChanges();
    });
  }

  tankorAtlag(): void {
    if (!this.tankorKereses.trim()) return;
    this.api.getTankorAtlag(this.tankorKereses.trim()).subscribe((a) => {
      this.tankorAtlagAdat = a;
      this.cdr.detectChanges();
    });
  }

  atlagSzin(atlag: number | null): string {
    if (atlag === null) return 'text-secondary';
    if (atlag >= 4.5) return 'text-success';
    if (atlag >= 3.5) return 'text-primary';
    if (atlag >= 2.5) return 'text-info';
    if (atlag >= 2) return 'text-warning';
    return 'text-danger';
  }
}
