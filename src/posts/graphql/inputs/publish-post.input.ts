import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class PublishPostInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string
}
