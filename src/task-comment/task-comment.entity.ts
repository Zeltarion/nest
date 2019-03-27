import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity({ name: 'task-comment' })
export class TaskComment extends BaseEntity {

  @Column({ length: 255, nullable: true, name: 'title' })
  title: string;

  @Column({ nullable: true, name: 'comment' })
  comment: string;

  @ManyToOne(type => User, user => user.taskComments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(type => Task, task => task.taskComments)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  constructor(partial: Partial<TaskComment>) {
    super();
    Object.assign(this, partial);
  }
}
