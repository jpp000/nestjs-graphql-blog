import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch(BadRequestError)
export class BadRequestErrorFilter implements GqlExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    return new GraphQLError(exception.message, {
      extensions: {
        code: 'BAD_REQUEST',
        httpStatus: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      },
    })
  }
}
