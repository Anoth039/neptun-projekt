export interface Oktato {
  id?: number;
  nev: string;
  tanszek: string;
  tantargyak?: Tantargy[];
}

export interface Hallgato {
  id?: number;
  nev: string;
  tankor: string;
  beiratkozasok?: Beiratkozas[];
}

export interface Tantargy {
  id?: number;
  nev: string;
  kredit: number;
  oktatoId?: number;
  oktato?: Oktato;
  kurzusok?: Kurzus[];
}

export interface Kurzus {
  id?: number;
  kurzusKod: string;
  felev: string;
  maxLetszam: number;
  tantargyId: number;
  tantargy?: Tantargy;
  beiratkozasok?: Beiratkozas[];
}

export interface Beiratkozas {
  id?: number;
  hallgatoId: number;
  kurzusId: number;
  jegy?: number | null;
  hallgato?: Hallgato;
  kurzus?: Kurzus;
}

export interface LoginRequest {
  felhasznalonev: string;
  jelszo: string;
}

export interface LoginResponse {
  token: string;
  felhasznalonev: string;
}
