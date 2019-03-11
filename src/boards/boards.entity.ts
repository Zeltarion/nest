import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { Tasks } from '../tasks/tasks.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'boards' })
export class Boards extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @OneToMany(type => Tasks, task => task.board)
  tasks: Tasks[];

  @ManyToMany(type => User, user => user.boards)
  @JoinTable({name: 'users_boards'})
  users: User[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
