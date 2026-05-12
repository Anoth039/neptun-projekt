import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tantargy } from './Tantargy';

@Entity()
export class Oktato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nev: string;

  @Column()
  tanszek: string;

  @OneToMany(() => Tantargy, (tantargy) => tantargy.oktato)
  tantargyak: Tantargy[];
}
