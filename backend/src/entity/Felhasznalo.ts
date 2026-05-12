import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Felhasznalo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  felhasznalonev: string;

  @Column()
  jelszo: string;

  @Column({ default: 'admin' })
  szerep: string;
}
