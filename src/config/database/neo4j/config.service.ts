import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Neo4jConfigService {
  constructor(private configService: ConfigService) {}

  get scheme():
    | 'neo4j'
    | 'neo4j+s'
    | 'neo4j+scc'
    | 'bolt'
    | 'bolt+s'
    | 'bolt+scc' {
    return this.configService.get<
      'neo4j' | 'neo4j+s' | 'neo4j+scc' | 'bolt' | 'bolt+s' | 'bolt+scc'
    >('neo4j.scheme');
  }
  get host(): string {
    return this.configService.get<string>('neo4j.host');
  }
  get port(): number {
    return Number(this.configService.get<number>('neo4j.port'));
  }
  get database(): string {
    return this.configService.get<string>('neo4j.database');
  }
  get username(): string {
    return this.configService.get<string>('neo4j.username');
  }
  get password(): string {
    return this.configService.get<string>('neo4j.password');
  }
}
