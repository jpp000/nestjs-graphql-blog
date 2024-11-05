import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Author {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field()
  createdAt: Date
}
