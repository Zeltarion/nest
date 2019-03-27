import { Entity, Column, JoinColumn, OneToOne, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { Task } from '../task/task.entity';

@Entity({ name: 'taskStatus' })
export class TaskStatus extends BaseEntity {

  @Column({ unique: true, length: 255 })
  name: string;

  @OneToOne(type => Task, task => task.taskStatus)
  task: Task;

  constructor(partial: Partial<TaskStatus>) {
    super();
    Object.assign(this, partial);
  }
}
