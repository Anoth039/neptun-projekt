import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hallgato } from './Hallgato';
import { Kurzus } from './Kurzus';

@Entity()
export class Beiratkozas {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hallgato, (h) => h.beiratkozasok, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hallgatoId' })
  hallgato: Hallgato;

  @Column()
  hallgatoId: number;

  @ManyToOne(() => Kurzus, (k) => k.beiratkozasok, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kurzusId' })
  kurzus: Kurzus;

  @Column()
  kurzusId: number;

  @Column({ nullable: true, type: 'int' })
  jegy: number | null;
}
