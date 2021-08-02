import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { RoadmapMockService } from './mock/roadmap.mock.service';
import { RecommendationMockService } from './mock/recommendation.mock.service';
import { IUserRequest } from './interfaces/request/user-request.interface';
import { IRoadMapResponse } from './interfaces/roadmap.interface';
import {
  GET_DEFAULT_ROADMAP_CYPHER,
  GET_ROADMAP_CATEGORIES_CYPHER,
  GET_ROADMAP_EDGES_CYPHER,
  GET_ROADMAP_PROBLEMS_CYPHER,
  GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
} from './constants/cyphers/roadmap';
import {
  ICategoryNode,
  INode,
  IProblemNode,
} from './interfaces/node.interface';
import { IEdge } from './interfaces/edge.interface';
import { ProblemNode } from './entities/nodes/problem.node';
import { CategoryNode } from './entities/nodes/category.node';
import { Edge } from './entities/edge/edge';
import {
  GET_RECENT_SOLVED_PROBLEMS,
  RECOMMEND_DEFAULT_PROBLEM,
  RECOMMEND_FIRST_PROBLEM,
  RECOMMEND_LESS_PROBLEM,
  RECOMMEND_NEXT_PROBLEM,
  RECOMMEND_WRONG_PROBLEM,
} from './constants/cyphers/recommend';
import { IProblemResponse } from './interfaces/response/problem-response.interface';
import { GET_USER_HISTORY } from './constants/cyphers/history';
import {
  CREATE_SOLVED_RELATION,
  GET_ALL_PROBLEMS,
  GET_NOT_SOLVED_PROBLEMS,
  GET_SOLVED_PROBMELS,
} from './constants/cyphers/problem';
import { ICreateSolvedRelations } from './interfaces/request/create-solved-relations-request.interface';
import { CREATE_USER, GET_ONE_USER, INIT_USER_SUCCESS } from './constants/user';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly roadmapMockService: RoadmapMockService,
    private readonly recommendationMockService: RecommendationMockService,
  ) {}

  async getDefaultRoadmap(): Promise<IRoadMapResponse> {
    const roadmap: IRoadMapResponse = {
      problems: [],
      categories: [],
      edges: [],
    };

    const datas = await this.neo4jService
      .read(GET_DEFAULT_ROADMAP_CYPHER)
      .then(({ records }) => records.map((record) => record['_fields'][0]));
    const problemNodes: INode[] = await this.neo4jService
      .read(GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((problemDatas) => problemDatas.filter((data) => data[0].labels));
    roadmap.problems = problemNodes.map((node) =>
      new ProblemNode(node[0].properties).toResponseObject(
        node[0].identity.low,
        false,
        false,
        [node[1].properties.name],
      ),
    );
    const nodes: INode[] = datas.filter((data) => data.labels);
    const edges: IEdge[] = datas.filter((data) => data.type);

    roadmap.categories = nodes
      .filter((node) => node.labels.includes('Category'))
      .map((node) =>
        new CategoryNode(node.properties as ICategoryNode).toResponseObject(
          node.identity.low,
        ),
      );

    roadmap.edges = edges.map((edge) => new Edge(edge).toResponseObject());

    return roadmap;
  }

  async getRoadMap(user: IUserRequest): Promise<IRoadMapResponse> {
    const roadmap: IRoadMapResponse = {
      problems: [],
      categories: [],
      edges: [],
    };

    const problemNodes: INode[] = await this.neo4jService
      .read(GET_ROADMAP_PROBLEMS_CYPHER, user)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((problemDatas) => problemDatas.filter((data) => data[0].labels));
    roadmap.problems = problemNodes.map((node) =>
      new ProblemNode(node[0].properties).toResponseObject(
        node[0].identity.low,
        node[1],
        true,
        [node[2].properties.name],
      ),
    );

    const categoryNodes: INode[] = await this.neo4jService
      .read(GET_ROADMAP_CATEGORIES_CYPHER, user)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((categoryDatas) => categoryDatas.filter((data) => data[2].labels));

    roadmap.categories = categoryNodes.map((node) =>
      new CategoryNode(node[2].properties).toResponseObject(
        node[2].identity.low,
        node[0],
        node[1],
      ),
    );

    roadmap.categories = roadmap.categories.filter((item, i) => {
      return (
        roadmap.categories.findIndex((item2, j) => {
          return item.name === item2.name;
        }) === i
      );
    });

    const edges: IEdge[] = await this.neo4jService
      .read(GET_ROADMAP_EDGES_CYPHER)
      .then(({ records }) => records.map((record) => record['_fields'][0]))
      .then((edgeDatas) => edgeDatas.filter((data) => data.type));

    roadmap.edges = edges.map((edge) => new Edge(edge).toResponseObject());

    return roadmap;
  }

  async recommendProblem(
    { limit, type },
    user?: IUserRequest,
  ): Promise<IProblemResponse[]> {
    let recommendProblemNodes: INode[];

    if (user) {
      if (type === 'next') {
        recommendProblemNodes = await this.recommendNextProblem(user, limit);
      } else if (type == 'less') {
        recommendProblemNodes = await this.recommendLessProblem(user, limit);
      } else if (type === 'wrong') {
        recommendProblemNodes = await this.recommendWrongProblem(user, limit);
      } else {
        recommendProblemNodes = await this.recommendFirstProblem(user, limit);
      }
    } else {
      recommendProblemNodes = await this.recommendDefaultProblem(limit);
    }

    return recommendProblemNodes.map((node) =>
      new ProblemNode(node.properties as IProblemNode).toResponseObject(
        node.identity.low,
      ),
    );
  }

  async getUserHistory(user: IUserRequest): Promise<IProblemResponse[]> {
    return this.neo4jService
      .read(GET_USER_HISTORY, user)
      .then(({ records }) =>
        records.map((record) => ({
          node: record['_fields'][0],
          relation: record['_fields'][1],
        })),
      )
      .then((records) =>
        records.map((data) =>
          new ProblemNode(
            Object.assign(data.node.properties, data.relation.properties),
          ).toResponseObject(data.node.identity.low),
        ),
      );
  }

  async getAllProblems(): Promise<IProblemResponse[]> {
    return this.neo4jService
      .read(GET_ALL_PROBLEMS)
      .then(({ records }) =>
        records.map((record) =>
          new ProblemNode(record['_fields'][0].properties).toResponseObject(
            record['_fields'][0].identity.low,
          ),
        ),
      );
  }

  async getUserSolvedProblems(user: IUserRequest): Promise<IProblemResponse[]> {
    return this.neo4jService
      .read(GET_SOLVED_PROBMELS, user)
      .then(({ records }) =>
        records.map((record) =>
          new ProblemNode(record['_fields'][0].properties).toResponseObject(
            record['_fields'][0].identity.low,
          ),
        ),
      );
  }

  async getUserNotSolvedProblems(
    user: IUserRequest,
  ): Promise<IProblemResponse[]> {
    return this.neo4jService
      .read(GET_NOT_SOLVED_PROBLEMS, user)
      .then(({ records }) =>
        records.map((record) =>
          new ProblemNode(record['_fields'][0].properties).toResponseObject(
            record['_fields'][0].identity.low,
          ),
        ),
      );
  }

  async createSolvedRelations(solvedProblemsData: ICreateSolvedRelations) {
    const { email, provider, attempts } = solvedProblemsData;
    await this.neo4jService.write(CREATE_USER, { email, provider });
    const CYPHER =
      CREATE_SOLVED_RELATION +
      attempts
        .map(
          (attempt) => `
    match(p:Problem {id: ${attempt.problemId}})
    merge (u)-[:Solved {try: ${attempt.attemptCount}, date: date("${attempt.time}")}]->(p)
    `,
        )
        .join('\nwith u\n');
    await this.neo4jService.write(CYPHER, { email, provider });
  }
  private async recommendDefaultProblem(limit): Promise<INode[]> {
    const defaultDatas = (
      await this.neo4jService.read(RECOMMEND_DEFAULT_PROBLEM)
    ).records.map((record) => record['_fields'][0]);
    return defaultDatas.filter((data) => data.labels).slice(0, limit);
  }

  private async recommendNextProblem(user, limit): Promise<INode[]> {
    const RecentlySolvedProblemNumber = await this.neo4jService
      .read(GET_RECENT_SOLVED_PROBLEMS, user)
      .then(({ records }) => records[0]['_fields'][0].low);

    const nextDatas = (
      await this.neo4jService.read(RECOMMEND_NEXT_PROBLEM, {
        ...user,
        problem_number: RecentlySolvedProblemNumber,
      })
    ).records.map((record) => record['_fields'][0]);
    return nextDatas.filter((data) => data.labels).slice(0, limit);
  }

  private async recommendLessProblem(user, limit): Promise<INode[]> {
    const lessDatas = (
      await this.neo4jService.read(RECOMMEND_LESS_PROBLEM, user)
    ).records.map((record) => record['_fields'][0]);
    return lessDatas.filter((data) => data.labels).slice(0, limit);
  }

  private async recommendWrongProblem(user, limit): Promise<INode[]> {
    const wrongDatas = (
      await this.neo4jService.read(RECOMMEND_WRONG_PROBLEM, user)
    ).records.map((record) => record['_fields'][0]);
    return wrongDatas.filter((data) => data.labels).slice(0, limit);
  }

  private async recommendFirstProblem(user, limit): Promise<INode[]> {
    const firstDatas = (
      await this.neo4jService.read(RECOMMEND_FIRST_PROBLEM, user)
    ).records.map((record) => record['_fields'][0]);
    return firstDatas.filter((data) => data.labels).slice(0, limit);
  }
}
