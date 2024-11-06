import { Author } from '@/authors/graphql/models/author'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string

  @Field(() => Boolean)
  published: boolean

  @Field()
  authorId: string

  @Field()
  createdAt: Date
}

// model Post {
//   id        String   @unique @default(uuid())
//   title     String
//   slug      String   @unique
//   content   String
//   published Boolean  @default(false)
//   author    Author   @relation(fields: [authorId], references: [id])
//   authorId  String
//   createdAt DateTime @default(now())
// }
