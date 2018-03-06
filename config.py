import os


class LocalConfig(object):
    APP_ENV = os.getenv('APP_ENV')
    DATABASE_URI = 'postgres://localhost:5432/bookreview'
    APP_PORT = 8080


class ProductionConfig(object):
    APP_ENV = os.getenv('APP_ENV')
    DATABASE_URI = ''  # TODO: RDS stuff here
    APP_PORT = 80
