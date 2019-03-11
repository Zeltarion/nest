import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { User } from '../user/user.entity';
import { Tasks } from '../tasks/tasks.entity';

@Entity({ name: 'task_comments' })
export class TaskComments extends BaseEntity {

  @Column({ length: 255, nullable: true, name: 'title' })
  title: string;

  @Column({ nullable: true, name: 'comment' })
  comment: string;

  @ManyToOne(type => User, user => user.taskComments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Tasks, task => task.taskComments)
  @JoinColumn({ name: 'task_id' })
  task: Tasks;

  constructor(partial: Partial<TaskComments>) {
    super();
    Object.assign(this, partial);
  }
}
