import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 50, primary: true, nullable: false, unique: true })
  email: string;

  @Column({ length: 100, nullable: false })
  password: string;
}
