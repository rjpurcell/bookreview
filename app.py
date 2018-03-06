from flask_script import Manager, Server

from bookreview import app


manager = Manager(app)
manager.add_command('runserver', Server(host='0.0.0.0', port=app.config['APP_PORT']))


if __name__ == '__main__':
    manager.run()
