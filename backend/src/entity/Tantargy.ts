import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Oktato } from './Oktato';
import { Kurzus } from './Kurzus';

@Entity()
export class Tantargy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nev: string;

  @Column()
  kredit: number;

  @ManyToOne(() => Oktato, (oktato) => oktato.tantargyak, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'oktatoId' })
  oktato: Oktato;

  @Column({ nullable: true })
  oktatoId: number;

  @OneToMany(() => Kurzus, (kurzus) => kurzus.tantargy)
  kurzusok: Kurzus[];
}
