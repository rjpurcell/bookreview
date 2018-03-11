import os


class LocalConfig(object):
    APP_ENV = os.getenv('APP_ENV')
    SQLALCHEMY_DATABASE_URI = 'postgres://postgres:postgres@localhost:5432/bookreview'
    APP_PORT = 8080
    SECRET_KEY = 'jgRdgWjbE9vIqVJE89i733xDThXTXdL8'


class ProductionConfig(object):
    APP_ENV = os.getenv('APP_ENV')
    SQLALCHEMY_DATABASE_URI = ''  # TODO: RDS stuff here
    APP_PORT = 80
