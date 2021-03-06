from flask import jsonify, Response
from flask_jwt import JWT, jwt_required, current_identity
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager, Server

from bookreview import app
from bookreview.models import *
from bookreview.views.account_view import account_blueprint
from bookreview.views.book_view import book_blueprint
from bookreview.views.review_view import review_blueprint

manager = Manager(app)
manager.add_command('db', MigrateCommand)
migrate = Migrate(app, db)
manager.add_command('runserver', Server(host='localhost', port=app.config['APP_PORT']))

jwt = JWT(app, UserModel.authenticate, UserModel.identity)

app.register_blueprint(account_blueprint)
app.register_blueprint(book_blueprint)
app.register_blueprint(review_blueprint)


@jwt.auth_response_handler
def authenticate_user(access_token, identity):
    if identity == UserErrors.USERNOTFOUND:
        response = Response('Username does not exist', status=401)
    elif identity == UserErrors.INVALIDPASSWORD:
        response = Response('Invalid password', status=401)
    else:
        response = jsonify({
            'access_token': access_token.decode('utf-8'),
            'user_id': identity.id
        })
    return response


@manager.command
def create_tables():
    db.create_all()


if __name__ == '__main__':
    db.init_app(app)
    manager.run()
