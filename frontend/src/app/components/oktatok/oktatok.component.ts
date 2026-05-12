import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Oktato } from '../../models/models';

@Component({
  selector: 'app-oktatok',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2><i class="bi bi-person-badge me-2"></i>Oktatók</h2>

    <div class="card mb-4" *ngIf="bejelentkezve">
      <div class="card-header">{{ szerkesztett ? 'Oktató szerkesztése' : 'Új oktató hozzáadása' }}</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-5">
            <input class="form-control" placeholder="Név" [(ngModel)]="forma.nev" />
          </div>
          <div class="col-md-5">
            <input class="form-control" placeholder="Tanszék" [(ngModel)]="forma.tanszek" />
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
            <th>#</th><th>Név</th><th>Tanszék</th><th>Tárgyak száma</th><th *ngIf="bejelentkezve">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let o of oktatok">
            <td>{{ o.id }}</td>
            <td>{{ o.nev }}</td>
            <td>{{ o.tanszek }}</td>
            <td>
              <span class="badge bg-info me-2">{{ o.tantargyak?.length || 0 }} tárgy</span>
              <button class="btn btn-sm btn-outline-info" (click)="kivalasztott = o">
                <i class="bi bi-eye"></i> Részletek
              </button>
            </td>
            <td *ngIf="bejelentkezve">
              <button class="btn btn-sm btn-warning me-1" (click)="szerkeszt(o)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" (click)="torol(o.id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade show d-block" *ngIf="kivalasztott" tabindex="-1" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ kivalasztott.nev }} – oktatott tárgyak</h5>
            <button type="button" class="btn-close btn-close-white" (click)="kivalasztott = null"></button>
          </div>
          <div class="modal-body">
            <p><strong>Tanszék:</strong> {{ kivalasztott.tanszek }}</p>
            <ul *ngIf="kivalasztott.tantargyak?.length">
              <li *ngFor="let t of kivalasztott.tantargyak">
                {{ t.nev }} – {{ t.kredit }} kredit
              </li>
            </ul>
            <p *ngIf="!kivalasztott.tantargyak?.length" class="text-muted">Nincs oktatott tárgy.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OktatokComponent implements OnInit {
  oktatok: Oktato[] = [];
  forma: Oktato = { nev: '', tanszek: '' };
  szerkesztett: Oktato | null = null;
  bejelentkezve = false;
  kivalasztott: Oktato | null = null;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.bejelentkezve.subscribe((v) => (this.bejelentkezve = v));
    this.betolt();
  }

  betolt(): void {
    this.api.getOktatok().subscribe((lista) => {
      this.oktatok = lista;
      this.cdr.detectChanges();
    });
  }

  mentes(): void {
    if (!this.forma.nev || !this.forma.tanszek) return;
    if (this.szerkesztett) {
      this.api.updateOktato(this.szerkesztett.id!, this.forma).subscribe(() => {
        this.betolt();
        this.megse();
      });
    } else {
      this.api.addOktato(this.forma).subscribe(() => {
        this.betolt();
        this.forma = { nev: '', tanszek: '' };
      });
    }
  }

  szerkeszt(o: Oktato): void {
    this.szerkesztett = o;
    this.forma = { nev: o.nev, tanszek: o.tanszek };
  }

  megse(): void {
    this.szerkesztett = null;
    this.forma = { nev: '', tanszek: '' };
  }

  torol(id: number): void {
    if (confirm('Biztosan törli?')) {
      this.api.deleteOktato(id).subscribe(() => this.betolt());
    }
  }
}
