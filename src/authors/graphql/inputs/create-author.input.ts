import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateAuthorInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string
}
