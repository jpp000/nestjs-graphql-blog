import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class ResolversResolver {
  @Query()
  getPostById() {}
}
