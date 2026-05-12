import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tantargy } from './Tantargy';
import { Beiratkozas } from './Beiratkozas';

@Entity()
export class Kurzus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kurzusKod: string;

  @Column()
  felev: string;

  @Column({ default: 30 })
  maxLetszam: number;

  @ManyToOne(() => Tantargy, (tantargy) => tantargy.kurzusok, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tantargyId' })
  tantargy: Tantargy;

  @Column()
  tantargyId: number;

  @OneToMany(() => Beiratkozas, (b) => b.kurzus)
  beiratkozasok: Beiratkozas[];
}
