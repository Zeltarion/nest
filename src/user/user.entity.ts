import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../common/entity/base.entity';
import { Task } from '../task/task.entity';
import { TaskComment } from '../taskComment/taskComment.entity';
import { Board } from '../board/board.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {

  @Column({ length: 255, select: false, nullable: true })
  @Exclude()
  password: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ length: 255, nullable: true, name: 'firstName' })
  firstName: string;

  @Column({ length: 255, nullable: true, name: 'lastName' })
  lastName: string;

  @Column({ length: 45, unique: true, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @OneToMany(type => Task, task => task.user)
  @JoinTable({name: 'userId'})
  tasks: Task[];

  @OneToMany(type => Task, task => task.user)
  @JoinTable({name: 'ownerId'})
  ownerTasks: Task[];

  @OneToMany(type => TaskComment,   taskComment => taskComment.user)
  @JoinTable({name: 'userId'})
  taskComments: TaskComment[];

  @ManyToMany(type => Board, board => board.users)
  @JoinTable({
    name: 'userBoard', // table name for the junction table of this relation
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'boardId',
      referencedColumnName: 'id',
    },
  })
  boards?: Board[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
