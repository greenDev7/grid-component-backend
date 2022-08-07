import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ length: 100, unique: true })
  cipher: String;

  @Column()
  createdOn: Date;

  @Column()
  inArchive: Boolean;
}
