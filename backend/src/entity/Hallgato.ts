import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Beiratkozas } from './Beiratkozas';

@Entity()
export class Hallgato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nev: string;

  @Column()
  tankor: string;

  @OneToMany(() => Beiratkozas, (b) => b.hallgato)
  beiratkozasok: Beiratkozas[];
}
