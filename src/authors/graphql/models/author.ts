import { Field, ID } from '@nestjs/graphql'

export class Author {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String)
  createdAt: string
}
