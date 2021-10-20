import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { GET_USER_HISTORY } from './constants/cyphers/history';
import { EdgeDto } from './dto/edge.dto';
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
  RECOMMEND_DESIREDCOMPANY_PROBLEM,
  NEXT_RECOMMEND_SIMILAR_PROBLEM,
  NEXT_RECOMMEND_NEW_CATEGORY_PROBLEM,
  RECOMMEND_NEXT_PROBLEM,
} from './constants/cyphers/recommend';
import {
  GET_100ROADMAP_CATEGORIES_CYPHER,
  GET_100ROADMAP_EDGES_CYPHER,
  GET_100ROADMAP_PROBLEMS_CYPHER,
  GET_DEFAULT_ROADMAP_CYPHER,
  GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
  GET_ROADMAP_CATEGORIES_CYPHER,
  GET_ROADMAP_EDGES_CYPHER,
  GET_ROADMAP_PROBLEMS_CYPHER,
  GET_COMPANY_ROADMAP_CATEGORIES_CYPHER,
  GET_COMPANY_ROADMAP_EDGES_CYPHER,
  GET_COMPANY_ROADMAP_PROBLEMS_CYPHER,
  GET_COMPANY_DEFAULT_ROADMAP_CYPHER,
  GET_COMPANY_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
} from './constants/cyphers/roadmap';
import { CREATE_USER } from './constants/user';
import { Edge } from './entities/edge/edge';
import { CategoryNode } from './entities/nodes/category.node';
import { ProblemNode } from './entities/nodes/problem.node';
import { ICreateSolvedRelations } from './interfaces/create-solved-relations-request.dto';
import { IEdgeRelationship } from './interfaces/edge-relationship.interface';
import { ITestcase } from './interfaces/problem-testcase.interface';
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
import { IUserProblemSolvingData } from './interfaces/user-problem-solving-history.interface';
@Injectable()
export class ProblemService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getRoadmap(type, user?: IJwtPayload): Promise<IRoadMap> {
    let roadmap: IRoadMap = {
      problems: [],
      categories: [],
      edges: [],
    };
    let query;
    let param;
    if (user) {
      if (type) {
        query = [
          GET_COMPANY_ROADMAP_PROBLEMS_CYPHER,
          GET_COMPANY_ROADMAP_CATEGORIES_CYPHER,
          GET_COMPANY_ROADMAP_EDGES_CYPHER,
        ];
        param = { ...user, company: type.toUpperCase() };
      } else {
        query = [
          GET_100ROADMAP_PROBLEMS_CYPHER,
          GET_100ROADMAP_CATEGORIES_CYPHER,
          GET_100ROADMAP_EDGES_CYPHER,
        ];
        param = { ...user };
      }
      roadmap = await this.getUserRoadmap(query, param);
    } else {
      if (type) {
        query = [
          GET_COMPANY_DEFAULT_ROADMAP_CYPHER,
          GET_COMPANY_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
        ];
        param = { company: type.toUpperCase() };
        roadmap = await this.getDefaultRoadmap(query, param);
      } else {
        query = [
          GET_DEFAULT_ROADMAP_CYPHER,
          GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER,
        ];
        roadmap = await this.getDefaultRoadmap(query);
      }
    }
    return roadmap;
  }

  async recommendProblem(
    { limit, type, problemId, company },
    user?: IJwtPayload,
  ): Promise<IProblem[]> {
    let recommendProblemNodes: INode[];
    if (user) {
      if (problemId) {
        recommendProblemNodes = [
          ...(await this.nextRecommendSimilarProblem(user, limit, problemId)),
          ...(await this.nextRecommendNewCateogryProblem(
            user,
            limit,
            problemId,
          )),
        ];
      } else if (type) {
        const checkUserData = (
          await this.neo4jService.read(GET_RECENT_SOLVED_PROBLEMS, { ...user })
        ).records.map((record) => record['_fields']);
        if (checkUserData.length === 0) {
          return [];
        }
        let queryDict = {};
        queryDict['next'] = RECOMMEND_NEXT_PROBLEM;
        queryDict['less'] = RECOMMEND_LESS_PROBLEM;
        queryDict['wrong'] = RECOMMEND_WRONG_PROBLEM;
        recommendProblemNodes = await this.recommendTypeProblem(
          user,
          limit,
          queryDict[type],
          company,
        );
      } else {
        const checkUserData = (
          await this.neo4jService.read(GET_RECENT_SOLVED_PROBLEMS, { ...user })
        ).records.map((record) => record['_fields']);
        if (checkUserData.length === 0) {
          recommendProblemNodes = await this.recommendDefaultProblem(limit);
        } else {
          console.log(0);
          recommendProblemNodes = await this.recommendFirstProblem(
            user,
            limit,
            company,
          );
        }
      }
    } else {
      recommendProblemNodes = await this.recommendDefaultProblem(limit);
    }
    return recommendProblemNodes.map((node) =>
      new ProblemNode(node[0].properties as IProblemProperty).toResponseObject(
        node[0].identity.low,
        false,
        false,
        node[1],
      ),
    );
  }
  async getDefaultRoadmap(query, param?): Promise<IRoadMap> {
    const roadmap: IRoadMap = {
      problems: [],
      categories: [],
      edges: [],
    };
    const datas = await this.neo4jService
      .read(query[0], param)
      .then(({ records }) => records.map((record) => record['_fields']));
    const problemNodes: INode[] = await this.neo4jService
      .read(query[1], param)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((problemDatas) => problemDatas.filter((data) => data[0].labels));
    const categoryNodes: INode[] = datas.filter((data) => data[0].labels);
    const edges: IEdgeRelationship[] = datas.filter((data) => data[0].type);
    roadmap.categories = categoryNodes
      .filter((node) => node[0].labels.includes('CATEGORY'))
      .map((node, index) =>
        new CategoryNode({
          name: node[0].properties.name,
          order: { low: index + 1, high: 0 },
        }).toResponseObject(node[0].identity.low, node[1].low),
      );
    roadmap.problems = problemNodes.map((node) =>
      new ProblemNode(node[0].properties).toResponseObject(
        node[0].identity.low,
        false,
        false,
        [node[1].properties.name],
      ),
    );
    roadmap.edges = edges.map((edge) => new Edge(edge[0]).toResponseObject());
    let categoryorder = categoryNodes.map((node) => {
      return { id: node[0].identity.low, order: node[0].properties.order.low };
    });
    let nextedge = categoryorder.sort(function (a, b) {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });
    for (let i = 0; i < nextedge.length - 1; i++) {
      roadmap.edges.push({
        from: nextedge[i].id,
        to: nextedge[i + 1].id,
        type: 'next',
      });
    }

    return roadmap;
  }
  async getUserRoadmap(query, param): Promise<IRoadMap> {
    const roadmap: IRoadMap = {
      problems: [],
      categories: [],
      edges: [],
    };

    const problemNodes: Promise<INode[]> = this.neo4jService
      .read(query[0], param)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((problemDatas) => problemDatas.filter((data) => data[0].labels));
    const categoryNodes: Promise<INode[]> = this.neo4jService
      .read(query[1], param)
      .then(({ records }) => records.map((record) => record['_fields']))
      .then((categoryDatas) => categoryDatas.filter((data) => data[2].labels));
    const edges: Promise<IEdgeRelationship[]> = this.neo4jService
      .read(query[2], param)
      .then(({ records }) => records.map((record) => record['_fields'][0]))
      .then((edgeDatas) => edgeDatas.filter((data) => data.type));
    const nodes = await Promise.all([problemNodes, categoryNodes, edges]);

    roadmap.problems = nodes[0].map((node) =>
      new ProblemNode(node[0].properties).toResponseObject(
        node[0].identity.low,
        node[1],
        true,
        [node[2].properties.name],
      ),
    );
    roadmap.categories = nodes[1].map((node, index) =>
      new CategoryNode({
        name: node[2].properties.name,
        order: { low: index + 1, high: 0 },
      }).toResponseObject(
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
    let categoryorder = (await categoryNodes).map((node) => {
      return { id: node[2].identity.low, order: node[2].properties.order.low };
    });
    roadmap.edges = nodes[2].map((edge) => new Edge(edge).toResponseObject());
    let nextedge = categoryorder.sort(function (a, b) {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });
    for (let i = 0; i < nextedge.length - 1; i++) {
      roadmap.edges.push({
        from: nextedge[i].id,
        to: nextedge[i + 1].id,
        type: 'next',
      });
    }
    return roadmap;
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
          (attempt) =>
            `
    match(p:PROBLEM {id: ${attempt.problemId}})
    merge (u)-[:solved {try: ${attempt.attemptCount}, date: date("${attempt.time}")}]->(p)
    `,
        )
        .join('\nwith u\n');
    await this.neo4jService.write(CYPHER, { email, provider });
  }
  private async recommendDefaultProblem(limit): Promise<INode[]> {
    const defaultDatas = (
      await this.neo4jService.read(RECOMMEND_DEFAULT_PROBLEM, { limit })
    ).records.map((record) => record['_fields']);
    return defaultDatas.filter((data) => data[0].labels);
  }
  private async recommendTypeProblem(
    user,
    limit,
    query,
    company,
  ): Promise<INode[]> {
    let param = {};
    if (company) {
      query = query.replace('// where', 'where');
      param = { ...user, limit, query, company: company.toUpperCase() };
    } else {
      param = { ...user, limit, query };
    }
    const Datas = (await this.neo4jService.read(query, param)).records.map(
      (record) => record['_fields'],
    );
    return Datas.filter((data) => data[0].labels);
  }
  private async recommendFirstProblem(user, limit, company): Promise<INode[]> {
    let query = RECOMMEND_FIRST_PROBLEM;
    let param = {};
    if (company) {
      query = query.replace('// and', 'and');
      param = { ...user, limit, query, company: company.toUpperCase() };
    } else {
      param = { ...user, limit, query };
    }
    const firstDatas = (await this.neo4jService.read(query, param)).records.map(
      (record) => record['_fields'],
    );
    return firstDatas.filter((data) => data[0].labels);
  }
  private async nextRecommendSimilarProblem(
    user,
    limit,
    problemId,
  ): Promise<INode[]> {
    const datas = (
      await this.neo4jService.read(NEXT_RECOMMEND_SIMILAR_PROBLEM, {
        ...user,
        limit,
        id: problemId,
      })
    ).records.map((record) => record['_fields']);
    return datas.filter((data) => data[0].labels);
  }
  private async nextRecommendNewCateogryProblem(
    user,
    limit,
    problemId,
  ): Promise<INode[]> {
    const datas = (
      await this.neo4jService.read(NEXT_RECOMMEND_NEW_CATEGORY_PROBLEM, {
        ...user,
        limit,
        id: problemId,
      })
    ).records.map((record) => record['_fields']);
    return datas.filter((data) => data[0].labels);
  }
  async getProblemInfo(id): Promise<IProblemInfo> {
    const CYPHER = `
    match(p:PROBLEM{id: $id})-[:main_tag]->(c:CATEGORY)
    return p, c
    `;
    const data = (
      await this.neo4jService.read(CYPHER, {
        id: id,
      })
    ).records.map((record) => record['_fields'])[0];
    const problem: IProblemInfo = {
      id: data[0].properties.id.low,
      level: data[0].properties.level.low,
      link: data[0].properties.link,
      title: data[0].properties.title,
      categories: [data[1].properties.name],
      contentHTML: data[0].properties.contentHtml,
    };

    return problem;
  }
  async checkProblem(id): Promise<boolean> {
    const CYPHER = `
    match(p:PROBLEM{id: $id})
    return p
    `;
    const checkData = (
      await this.neo4jService.read(CYPHER, {
        id,
      })
    ).records.map((record) => record);
    if (checkData.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  async getProblemTestcase(id): Promise<ITestcase[]> {
    let testcase: ITestcase[] = [];
    const CYPHER = `match (p:PROBLEM{id:$id})
    return p.input, p.output
    `;
    const data = (
      await this.neo4jService.read(CYPHER, {
        id: id,
      })
    ).records.map((record) => record['_fields'])[0];
    const input = data[0];
    const answer = data[1];
    for (let i = 0; i < input.length; i++) {
      testcase.push({
        input: input[i],
        answer: answer[i],
      });
    }
    return testcase;
  }
  async postUserSolvingData(
    Data: IUserProblemSolvingData,
    user: IJwtPayload,
    id,
  ) {
    const {
      success,
      isSolved,
      result,
      submitTimestamp,
      solvedTime,
      executedTime,
    } = Data;
    const CYPHER = `
      match (u:USER{email:$email, provider:$provider}), (p:PROBLEM{id:$id})
      merge (u)-[r:submit{success:$success, isSolved:$isSolved, result:$result, submitTimestamp:datetime($submitTimestamp),solvedTime:toInteger($solvedTime), executedTime:$executedTime}]->(p)
      `;
    await this.neo4jService.write(CYPHER, {
      id,
      success,
      isSolved,
      result,
      submitTimestamp,
      solvedTime,
      executedTime,
      ...user,
    });
  }
  async postUserData(
    email: string,
    provider: string,
    desiredCompanies?: string[],
  ) {
    let CYPHER = `
    merge(u:USER{email:$email, provider:$provider})
    `;
    if (desiredCompanies !== undefined) {
      desiredCompanies.map(
        (data) =>
          (CYPHER =
            `match(${data}:COMPANY{name:"${data.toUpperCase()}"})` + CYPHER),
      );
      desiredCompanies.map(
        (data) => (CYPHER += `merge (u)-[:desire]->(${data})`),
      );
    }
    await this.neo4jService.write(CYPHER, { email, provider });
  }
}
