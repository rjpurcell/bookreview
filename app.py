from flask_jwt import current_identity, JWT, jwt_required
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager, Server

from bookreview import app
from bookreview.models import *

manager = Manager(app)
manager.add_command('db', MigrateCommand)
migrate = Migrate(app, db)
manager.add_command('runserver', Server(host='localhost', port=app.config['APP_PORT']))

jwt = JWT(app, UserModel.authenticate, UserModel.identity)


@manager.command
def create_tables():
    db.create_all()


if __name__ == '__main__':
    db.init_app(app)
    manager.run()
