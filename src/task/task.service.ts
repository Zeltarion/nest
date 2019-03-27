import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, In } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { TaskStatus } from '../task-status/task-status.entity';
import { Board } from '../board/board.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { QueryOrder } from '../common/enums/query-order.enum';
import { find } from 'lodash/find';
import { DEFAULT_STATUS_ID } from '../config';

const relations = [
  'board',
];

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TaskStatus)
    private readonly taskStatusRepository: Repository<TaskStatus>,
  ) { }

  async create(taskDto: CreateTaskDto, user: User, board: Board, ownerId: number): Promise<Task> {
    const params = {
      ...taskDto,
    };
    let task = new Task({});
    await getManager().transaction(async transactionalEntityManager => {
      const taskStatus = await this.taskStatusRepository.findOne(DEFAULT_STATUS_ID);
      const owner = await this.userRepository.findOne(ownerId);
      task.name = params.name;
      task.taskStatus = taskStatus;
      task.board = board;
      task.owner = owner;
      task.user = user;
      task = await transactionalEntityManager.save(Task, task);
    });

    return this.taskRepository.findOne(task.id, { relations });
  }

  async findBoardTasks(boardId: number, query: FilterTaskDto): Promise<any> {
    const { count, page, orderType = QueryOrder.DESC, orderBy, userId } = query;
    const queryParameters = { boardId };
    let skip: number;
    let sqlQuery: any;
    const sqlQueryCount = getManager().createQueryBuilder().select('task').from(Task, 'task');
    const allTasks = await sqlQueryCount.getCount();

    sqlQuery = this.taskRepository.createQueryBuilder('task');
    if (count && page) {
      skip = 0;
      if (page !== '1') {
        skip = (parseInt(count, 10) * (parseInt(page, 10) - 1));
      }

      sqlQuery
        .take(count)
        .skip(skip);
    }

    sqlQuery = sqlQuery.leftJoinAndSelect('task.user', 'user');
    sqlQuery = sqlQuery.leftJoinAndSelect('task.owner', 'owner');
    sqlQuery = sqlQuery.leftJoinAndSelect('task.taskStatus', 'taskStatus');

    sqlQuery.where('task.boardId = :boardId');
    if (userId) {
      sqlQuery = sqlQuery.andWhere('task.userId = :userId');
      // tslint:disable:no-string-literal
      queryParameters['userId'] = userId;
    }

    sqlQuery.setParameters(queryParameters);

    if (orderBy) {
      const order = {};
      order[`task.${orderBy}`] = orderType || QueryOrder.DESC;
      sqlQuery
        .orderBy(order);
    }

    const tasks = await sqlQuery
      .getMany();

    return {
      count,
      page,
      total: allTasks,
      data: tasks as Task[],
    };
  }

  async findById(id: number | string): Promise<Task | {}> {
    const task = await this.taskRepository.findOne(id, { relations });
    return task || {};
  }

  async remove(id: number): Promise<any> {
    return this.taskRepository.delete({ id });
  }
}
