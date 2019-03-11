import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { Tasks } from '../tasks/tasks.entity';
import { TaskComments } from '../task_comments/task_comments.entity';
import { Boards } from '../boards/boards.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {

  @Column({ length: 255, select: false, nullable: true })
  @Exclude()
  password: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ length: 255, nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ length: 255, nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ length: 45, unique: true, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  photo: string;

  @OneToMany(type => Tasks, task => task.user)
  @JoinTable({name: 'user_id'})
  tasks: Tasks[];

  @OneToMany(type => Tasks, task => task.user)
  @JoinTable({name: 'owner_id'})
  ownerTasks: Tasks[];

  @OneToMany(type => TaskComments, taskComment => taskComment.user)
  @JoinTable({name: 'user_id'})
  taskComments: TaskComments[];

  @ManyToMany(type => Boards, board => board.users)
  @JoinTable({name: 'users_boards'})
  boards: Boards[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
