import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { ConflictError } from '@/shared/errors/conflict-error'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch(ConflictError)
export class ConflictErrorFilter implements GqlExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    return new GraphQLError(exception.message, {
      extensions: {
        code: 'CONFLICT_ERROR',
        httpStatus: HttpStatus.CONFLICT,
        timestamp: new Date().toISOString(),
      },
    })
  }
}
