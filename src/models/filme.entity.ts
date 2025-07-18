import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Filme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  title: string;

  @Column()
  studios: string;

  @Column()
  producers: string;

  @Column({ default: false })
  winner: boolean;
}
