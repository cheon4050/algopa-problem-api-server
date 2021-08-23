import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { GET_USER_HISTORY } from './constants/cyphers/history';
import {
  CREATE_SOLVED_RELATION,
  GET_ALL_PROBLEMS,
  GET_NOT_SOLVED_PROBLEMS,
  GET_SOLVED_PROBMELS,
} from './constants/cyphers/problem';
import {
  GET_RECENT_SOLVED_PROBLEMS,
  RECOMMEND_DEFAULT_PROBLEM,
  RECOMMEND_FIRST_PROBLEM,
  RECOMMEND_LESS_PROBLEM,
  RECOMMEND_WRONG_PROBLEM,
} from './constants/cyphers/recommend';
import {
  GET_DEFAULT_ROADMAP_CYPHER,
  GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
  GET_ROADMAP_CATEGORIES_CYPHER,
  GET_ROADMAP_EDGES_CYPHER,
  GET_ROADMAP_PROBLEMS_CYPHER,
} from './constants/cyphers/roadmap';
import { CREATE_USER } from './constants/user';
import { Edge } from './entities/edge/edge';
import { CategoryNode } from './entities/nodes/category.node';
import { ProblemNode } from './entities/nodes/problem.node';
import { ICreateSolvedRelations } from './interfaces/create-solved-relations-request.dto';
import { IEdgeRelationship } from './interfaces/edge-relationship.interface';
import {
  ICategoryProperty,
  INode,
  IProblemProperty,
} from './interfaces/node.interface';
import {
  IProblem,
  IProblemInfo,
  ISolvedProblem,
} from './interfaces/problem.interface';
import { IRoadMap } from './interfaces/roadmap.interface';
import axios from 'axios';
import { load } from 'cheerio';

@Injectable()
export class ProblemService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDefaultRoadmap(): Promise<IRoadMap> {
    const roadmap: IRoadMap = {
      problems: [],
      categories: [],
      edges: [],
    };

    const datas = await this.neo4jService
      .read(GET_DEFAULT_ROADMAP_CYPHER)
      .then(({ records }) => records.map((record) => record['_fields']));
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
    const nodes: INode[] = datas.filter((data) => data[0].labels);
    const edges: IEdgeRelationship[] = datas.filter((data) => data[0].type);
    roadmap.categories = nodes
      .filter((node) => node[0].labels.includes('Category'))
      .map((node) =>
        new CategoryNode(
          node[0].properties as ICategoryProperty,
        ).toResponseObject(node[0].identity.low, node[1].low),
      );
    roadmap.edges = edges.map((edge) => new Edge(edge[0]).toResponseObject());
    return roadmap;
  }

  async getRoadMap(user: IJwtPayload): Promise<IRoadMap> {
    const roadmap: IRoadMap = {
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
        node[4].low,
        node[0],
        node[1],
        node[3].low,
      ),
    );
    roadmap.categories = roadmap.categories.filter((item, i) => {
      return (
        roadmap.categories.findIndex((item2, j) => {
          return item.name === item2.name;
        }) === i
      );
    });

    const edges: IEdgeRelationship[] = await this.neo4jService
      .read(GET_ROADMAP_EDGES_CYPHER)
      .then(({ records }) => records.map((record) => record['_fields'][0]))
      .then((edgeDatas) => edgeDatas.filter((data) => data.type));

    roadmap.edges = edges.map((edge) => new Edge(edge).toResponseObject());

    return roadmap;
  }

  async recommendProblem(
    { limit, type },
    user?: IJwtPayload,
  ): Promise<IProblem[]> {
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
      new ProblemNode(node[0].properties as IProblemProperty).toResponseObject(
        node[0].identity.low,
        false,
        false,
        [node[1].properties.name],
      ),
    );
  }

  async getUserHistory(user: IJwtPayload): Promise<ISolvedProblem[]> {
    return this.neo4jService
      .read(GET_USER_HISTORY, user)
      .then(({ records }) =>
        records.map((record) => ({
          node: record['_fields'][0],
          relation: record['_fields'][1],
        })),
      )
      .then((records) =>
        records.map(
          (data) =>
            new ProblemNode(
              Object.assign(data.node.properties, data.relation.properties),
            ).toResponseObject(data.node.identity.low) as ISolvedProblem,
        ),
      );
  }

  async getAllProblems(): Promise<IProblem[]> {
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

  async getUserSolvedProblems(user: IJwtPayload): Promise<IProblem[]> {
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

  async getUserNotSolvedProblems(user: IJwtPayload): Promise<IProblem[]> {
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
    ).records.map((record) => record['_fields']);
    return defaultDatas.filter((data) => data[0].labels).slice(0, limit);
  }

  private async recommendNextProblem(user, limit): Promise<INode[]> {
    const RecentlySolvedProblemNumbers = await this.neo4jService
      .read(GET_RECENT_SOLVED_PROBLEMS, user)
      .then(({ records }) => records);
    if (RecentlySolvedProblemNumbers.length == 0) {
      return await this.recommendFirstProblem(user, limit);
    }

    const CYPHER = RecentlySolvedProblemNumbers.map(
      (number) => `
      match (p:Problem {id: ${number['_fields'][0].low}})-[:IN]->(c:Category),
      (u:User {email: $email, provider: $provider})
      match (p1:Problem)-[:IN]->(c)
      where p.level <= p1.level and not (u)-[:Solved]->(p1)
      return p1, c
      union
      match(p:Problem {id:${number['_fields'][0].low}})-[:IN]->(c:Category),
      (c:Category)-[:next]->(c1:Category), (u:User {email: $email, provider: $provider})
      match(c1)<-[:IN]-(p2:Problem)
      where not (u)-[:Solved]->(p2)
      return p2 as p1, c
      `,
    ).join(`\nunion \n`);
    const nextDatas = (
      await this.neo4jService.read(CYPHER, {
        ...user,
      })
    ).records.map((record) => record['_fields']);
    return nextDatas.filter((data) => data[0].labels).slice(0, limit);
  }

  private async recommendLessProblem(user, limit): Promise<INode[]> {
    const lessDatas = (
      await this.neo4jService.read(RECOMMEND_LESS_PROBLEM, user)
    ).records.map((record) => record['_fields']);
    return lessDatas.filter((data) => data[0].labels).slice(0, limit);
  }

  private async recommendWrongProblem(user, limit): Promise<INode[]> {
    const wrongDatas = (
      await this.neo4jService.read(RECOMMEND_WRONG_PROBLEM, user)
    ).records.map((record) => record['_fields']);
    return wrongDatas.filter((data) => data[0].labels).slice(0, limit);
  }

  private async recommendFirstProblem(user, limit): Promise<INode[]> {
    const firstDatas = (
      await this.neo4jService.read(RECOMMEND_FIRST_PROBLEM, user)
    ).records.map((record) => record['_fields']);
    return firstDatas.filter((data) => data[0].labels).slice(0, limit);
  }
  async getProblemInfo(id): Promise<IProblemInfo> {
    const CYPHER = `
    match(p:Problem{id: $id})-[:IN]->(c:Category)
    return p, c
    `;
    const data = (
      await this.neo4jService.read(CYPHER, {
        id: id,
      })
    ).records.map((record) => record['_fields'])[0];
    const problem: IProblemInfo = {
      number: data[0].properties.id.low,
      level: data[0].properties.level.low,
      link: data[0].properties.link,
      title: data[0].properties.title,
      categories: [data[1].properties.name],
      contentHTML: '',
    };
    const getHtml = async () => {
      try {
        return await axios.get(`https://www.acmicpc.net/problem/${id}`);
      } catch (error) {}
    };
    const html = await getHtml()
      .then((html) => {
        const $ = load(html.data);
        const $bodyList = $('body')
          .children('div.wrapper')
          .children('div.container.content');
        return $bodyList.html();
      })
      .then((data) =>
        data.replace(/\/category\//g, 'https://www.acmicpc.net/category/'),
      );
    problem.contentHTML =
      '<div class="container content">' + html.toString() + '</div>';
    return problem;
  }
}
