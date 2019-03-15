import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, In } from 'typeorm';
import { Board } from './board.entity';
import { User } from '../user/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { FilterBoardDto } from './dto/filter-board.dto';
import { QueryOrder } from '../common/enums/query-order.enum';

const relations = [
  'users',
];

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(query: FilterBoardDto): Promise<any> {
    const { count, page, orderType = QueryOrder.DESC, orderBy } = query;
    let skip, sqlQuery;
    const sqlQueryCount = getManager().createQueryBuilder().select('board').from(Board, 'board');
    const allBoards = await sqlQueryCount.getCount();

    sqlQuery = this.boardRepository.createQueryBuilder('board');
    if (count && page) {
      skip = 0;
      if (page !== '1') {
        skip = (parseInt(count, 10) * (parseInt(page, 10) - 1));
      }

      sqlQuery
        .take(count)
        .skip(skip);
    }

    sqlQuery = sqlQuery.leftJoinAndSelect('board.users', 'users');

    if (orderBy) {
      const order = {};
      order[`board.${orderBy}`] = orderType || QueryOrder.DESC;
      sqlQuery
        .orderBy(order);
    }

    const boards = await sqlQuery
      .getMany();

    return {
      count,
      page,
      total: allBoards,
      data: boards as Board[],
    };
  }

  async findById(id: number | string): Promise<Board | {}> {
    // return this.boardRepository.findOne(id, { relations });
    const board = await this.boardRepository.findOne(id, { relations });
    return board || {};
  }

  /**
   * Create board with participants
   */
  async create(boardDto: CreateBoardDto): Promise<Board> {
    const params = {
      ...boardDto,
    };
    let board = new Board({});
    await getManager().transaction(async transactionalEntityManager => {
      board.name = params.name;
      if (params.userIds) {
        const users = await this.userRepository.findByIds(params.userIds);
        board.users = users;
      }
      board = await transactionalEntityManager.save(board);
    });

    return this.boardRepository.findOne(board.id, { relations });
  }

  async remove(id: number): Promise<any> {
    return this.boardRepository.delete({ id });
  }
}
