import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oktato, Hallgato, Tantargy, Kurzus, Beiratkozas } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getOktatok(): Observable<Oktato[]> {
    return this.http.get<Oktato[]>(`${this.base}/oktatok`);
  }
  getOktato(id: number): Observable<Oktato> {
    return this.http.get<Oktato>(`${this.base}/oktatok/${id}`);
  }
  addOktato(o: Oktato): Observable<Oktato> {
    return this.http.post<Oktato>(`${this.base}/oktatok`, o);
  }
  updateOktato(id: number, o: Partial<Oktato>): Observable<Oktato> {
    return this.http.put<Oktato>(`${this.base}/oktatok/${id}`, o);
  }
  deleteOktato(id: number): Observable<any> {
    return this.http.delete(`${this.base}/oktatok/${id}`);
  }

  getHallgatok(): Observable<Hallgato[]> {
    return this.http.get<Hallgato[]>(`${this.base}/hallgatok`);
  }
  getHallgato(id: number): Observable<Hallgato> {
    return this.http.get<Hallgato>(`${this.base}/hallgatok/${id}`);
  }
  getHallgatoAtlag(id: number): Observable<{ atlag: number | null; jegyek: number }> {
    return this.http.get<any>(`${this.base}/hallgatok/${id}/atlag`);
  }
  addHallgato(h: Hallgato): Observable<Hallgato> {
    return this.http.post<Hallgato>(`${this.base}/hallgatok`, h);
  }
  updateHallgato(id: number, h: Partial<Hallgato>): Observable<Hallgato> {
    return this.http.put<Hallgato>(`${this.base}/hallgatok/${id}`, h);
  }
  deleteHallgato(id: number): Observable<any> {
    return this.http.delete(`${this.base}/hallgatok/${id}`);
  }

  getTantargyak(): Observable<Tantargy[]> {
    return this.http.get<Tantargy[]>(`${this.base}/tantargyak`);
  }
  addTantargy(t: Tantargy): Observable<Tantargy> {
    return this.http.post<Tantargy>(`${this.base}/tantargyak`, t);
  }
  updateTantargy(id: number, t: Partial<Tantargy>): Observable<Tantargy> {
    return this.http.put<Tantargy>(`${this.base}/tantargyak/${id}`, t);
  }
  deleteTantargy(id: number): Observable<any> {
    return this.http.delete(`${this.base}/tantargyak/${id}`);
  }

  getKurzusok(): Observable<Kurzus[]> {
    return this.http.get<Kurzus[]>(`${this.base}/kurzusok`);
  }
  getKurzus(id: number): Observable<Kurzus> {
    return this.http.get<Kurzus>(`${this.base}/kurzusok/${id}`);
  }
  addKurzus(k: Kurzus): Observable<Kurzus> {
    return this.http.post<Kurzus>(`${this.base}/kurzusok`, k);
  }
  updateKurzus(id: number, k: Partial<Kurzus>): Observable<Kurzus> {
    return this.http.put<Kurzus>(`${this.base}/kurzusok/${id}`, k);
  }
  deleteKurzus(id: number): Observable<any> {
    return this.http.delete(`${this.base}/kurzusok/${id}`);
  }

  getBeiratkozasok(): Observable<Beiratkozas[]> {
    return this.http.get<Beiratkozas[]>(`${this.base}/beiratkozasok`);
  }
  addBeiratkozas(b: { hallgatoId: number; kurzusId: number }): Observable<Beiratkozas> {
    return this.http.post<Beiratkozas>(`${this.base}/beiratkozasok`, b);
  }
  setJegy(id: number, jegy: number): Observable<Beiratkozas> {
    return this.http.patch<Beiratkozas>(`${this.base}/beiratkozasok/${id}/jegy`, { jegy });
  }
  deleteBeiratkozas(id: number): Observable<any> {
    return this.http.delete(`${this.base}/beiratkozasok/${id}`);
  }
  getTankorAtlag(tankor: string): Observable<any> {
    return this.http.get(`${this.base}/beiratkozasok/tankor-atlag/${encodeURIComponent(tankor)}`);
  }
}
