import { Entity, Column, ManyToMany, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'board' })
export class Board extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @OneToMany(type => Task, task => task.board)
  tasks?: Task[];

  @ManyToMany(type => User, user => user.boards)
  // @JoinTable({name: 'userBoard'})
  users?: User[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
