import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Hallgato } from '../../models/models';

@Component({
  selector: 'app-hallgatok',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-people me-2"></i>Hallgatók</h2>

    <div class="card mb-4" *ngIf="bejelentkezve">
      <div class="card-header">{{ szerkesztett ? 'Hallgató szerkesztése' : 'Új hallgató hozzáadása' }}</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-5">
            <input class="form-control" placeholder="Név" [(ngModel)]="forma.nev" />
          </div>
          <div class="col-md-5">
            <input class="form-control" placeholder="Tankör (pl. IB-0AB)" [(ngModel)]="forma.tankor" />
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
            <th>#</th><th>Név</th><th>Tankör</th><th>Felvett tárgyak</th><th>Átlag</th><th *ngIf="bejelentkezve">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let h of hallgatok">
            <td>{{ h.id }}</td>
            <td>{{ h.nev }}</td>
            <td><span class="badge bg-secondary">{{ h.tankor }}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-info" (click)="reszletek(h)">
                <i class="bi bi-eye"></i> Részletek
              </button>
            </td>
            <td>
              <span *ngIf="atlagok[h.id!] !== undefined">
                {{ atlagok[h.id!] !== null ? (atlagok[h.id!] | number:'1.2-2') : '–' }}
              </span>
            </td>
            <td *ngIf="bejelentkezve">
              <button class="btn btn-sm btn-warning me-1" (click)="szerkeszt(h)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" (click)="torol(h.id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade show d-block" *ngIf="kivalasztott" tabindex="-1" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ kivalasztott.nev }} – felvett tárgyak</h5>
            <button type="button" class="btn-close btn-close-white" (click)="kivalasztott = null"></button>
          </div>
          <div class="modal-body">
            <p><strong>Tankör:</strong> {{ kivalasztott.tankor }}</p>
            <table class="table table-sm" *ngIf="kivalasztott.beiratkozasok?.length">
              <thead><tr><th>Tantárgy</th><th>Kurzus</th><th>Félév</th><th>Érdemjegy</th></tr></thead>
              <tbody>
                <tr *ngFor="let b of kivalasztott.beiratkozasok">
                  <td>{{ b.kurzus?.tantargy?.nev }}</td>
                  <td>{{ b.kurzus?.kurzusKod }}</td>
                  <td>{{ b.kurzus?.felev }}</td>
                  <td>
                    <span class="badge" [ngClass]="jegyBadge(b.jegy)">
                      {{ b.jegy ?? 'Nincs jegy' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p *ngIf="!kivalasztott.beiratkozasok?.length" class="text-muted">Nincs felvett tárgy.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HallgatokComponent implements OnInit {
  hallgatok: Hallgato[] = [];
  forma: Hallgato = { nev: '', tankor: '' };
  szerkesztett: Hallgato | null = null;
  kivalasztott: Hallgato | null = null;
  bejelentkezve = false;
  atlagok: { [id: number]: number | null } = {};

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.bejelentkezve.subscribe((v) => (this.bejelentkezve = v));
    this.betolt();
  }

  betolt(): void {
    this.api.getHallgatok().subscribe((lista) => {
      this.hallgatok = lista;
      this.cdr.detectChanges();
      lista.forEach((h) => {
        this.api.getHallgatoAtlag(h.id!).subscribe((a) => {
          this.atlagok[h.id!] = a.atlag;
          this.cdr.detectChanges();
        });
      });
    });
  }

  reszletek(h: Hallgato): void {
    this.api.getHallgato(h.id!).subscribe((reszlet) => {
      this.kivalasztott = reszlet;
      this.cdr.detectChanges();
    });
  }

  mentes(): void {
    if (!this.forma.nev || !this.forma.tankor) return;
    if (this.szerkesztett) {
      this.api.updateHallgato(this.szerkesztett.id!, this.forma).subscribe(() => {
        this.betolt();
        this.megse();
      });
    } else {
      this.api.addHallgato(this.forma).subscribe(() => {
        this.betolt();
        this.forma = { nev: '', tankor: '' };
      });
    }
  }

  szerkeszt(h: Hallgato): void {
    this.szerkesztett = h;
    this.forma = { nev: h.nev, tankor: h.tankor };
  }

  megse(): void {
    this.szerkesztett = null;
    this.forma = { nev: '', tankor: '' };
  }

  torol(id: number): void {
    if (confirm('Biztosan törli?')) {
      this.api.deleteHallgato(id).subscribe(() => this.betolt());
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
