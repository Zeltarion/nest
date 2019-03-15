import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { User } from '../user/user.entity';
import { TaskComment } from '../taskComment/taskComment.entity';
import { Board } from '../board/board.entity';

@Entity({ name: 'task' })
export class Task extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({})
  status: boolean;

  @ManyToOne(type => User, user => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(type => User, user => user.ownerTasks)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(type => TaskComment, taskComment => taskComment.task)
  @JoinColumn({ name: 'taskId' })
  taskComments: TaskComment[];

  @ManyToOne(type => Board, board => board.tasks)
  @JoinColumn({ name: 'ownerId' })
  board: Board;

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
