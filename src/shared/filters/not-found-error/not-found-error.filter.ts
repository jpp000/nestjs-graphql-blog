import { NotFoundError } from '@/shared/errors/not-found-error'
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch(NotFoundError)
export class NotFoundErrorFilter implements GqlExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    return new GraphQLError(exception.message, {
      extensions: {
        code: 'NOT_FOUND',
        httpStatus: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      },
    })
  }
}
