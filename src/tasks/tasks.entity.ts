import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { User } from '../user/user.entity';
import { TaskComments } from '../task_comments/task_comments.entity';
import { Boards } from '../boards/boards.entity';

@Entity({ name: 'tasks' })
export class Tasks extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({})
  status: boolean;

  @ManyToOne(type => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => User, user => user.ownerTasks)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(type => TaskComments, taskComment => taskComment.task)
  @JoinColumn({ name: 'task_id' })
  taskComments: TaskComments[];

  @ManyToOne(type => Boards, board => board.tasks)
  @JoinColumn({ name: 'owner_id' })
  board: Boards;

  constructor(partial: Partial<Tasks>) {
    super();
    Object.assign(this, partial);
  }
}
