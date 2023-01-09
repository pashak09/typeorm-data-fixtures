import { UserFixture } from './UserFixture';
import { BaseStaticFixture } from '../../src';
import { Article } from '../entity/Article';
import { EntityManager } from 'typeorm';
import { StaticFixture } from '../../src';

@StaticFixture({ dependencies: [UserFixture] })
export class ArticleFixture extends BaseStaticFixture<readonly Article[]> {
  public async install(manager: EntityManager): Promise<readonly Article[]> {
    const [firstUser, secondUser] = this.fixtureResultOf(UserFixture);

    const firstArticle = new Article(firstUser, 'hey');
    const secondArticle = new Article(secondUser, 'hey');
    const articles = [firstArticle, secondArticle];

    await manager.save(articles);

    return articles;
  }
}
