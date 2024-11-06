import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConflictErrorFilter } from './shared/filters/conflict-error/conflict-error.filter'
import { BadRequestErrorFilter } from './shared/filters/bad-request-error/bad-request-error.filter'
import { NotFoundErrorFilter } from './shared/filters/not-found-error/not-found-error.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  app.useGlobalFilters(new ConflictErrorFilter())
  app.useGlobalFilters(new BadRequestErrorFilter())
  app.useGlobalFilters(new NotFoundErrorFilter())

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
