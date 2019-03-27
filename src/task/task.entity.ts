import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { User } from '../user/user.entity';
import { TaskComment } from '../task-comment/task-comment.entity';
import { Board } from '../board/board.entity';
import { TaskStatus } from '../task-status/task-status.entity';

@Entity({ name: 'task' })
export class Task extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({})
  description: string;

  @Column({})
  boardId: number;

  @OneToOne(type => TaskStatus, taskStatus => taskStatus.task)
  @JoinColumn({ name: 'statusId' })
  taskStatus: TaskStatus;

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
  @JoinColumn({ name: 'boardId' })
  board: Board;

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
