import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ length: 10, primary: true, nullable: false, unique: true })
  currency: string;
}
