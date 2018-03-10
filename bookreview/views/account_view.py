from flask import jsonify, request
from flask_jwt import current_identity, jwt_required
from bookreview import app
from bookreview.models import db
from bookreview.models.user_model import UserModel


def email_taken(user, email):
    if not email:
        return False
    if user.email != email and UserModel.get_user_by_email(email):
        return True
    return False


def username_taken(user, username):
    if not username:
        return False
    if user.username != username and UserModel.get_user_by_username(username):
        return True
    return False


@app.route('/account/get/<int:user_id>', methods=['GET'])
def get_account(user_id):
    user = UserModel.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'error': 'No such user'})


@app.route('/account/create', methods=['POST'])
def create_account():
    email = request.json['email']
    username = request.json['username']
    password = request.json['password']
    about_me = request.json['about_me']
    profile_pic_url = request.json['profile_pic_url']

    if UserModel.get_user_by_email(email):
        return jsonify({'error': 'Email address already exists'})
    if UserModel.get_user_by_username(username):
        return jsonify({'error': 'Username is already taken'})
    user = UserModel(
        username, email, password, about_me=about_me, profile_pic=profile_pic_url
    ).save()
    return jsonify({'user_id': user.id})


@jwt_required
@app.route('/account/edit', methods=['POST'])
def create_account():
    password = request.json.pop('password')

    if email_taken(current_identity, request.json.get('email')):
        return jsonify({'error': 'Email address already taken'})

    if username_taken(current_identity, request.json.get('username')):
        return jsonify({'error': 'Username already taken'})

    if password:
        current_identity.update_password(password)

    current_identity.update(request.json)

    return jsonify(current_identity.to_dict())


@app.route('/account/delete/<int:user_id>', methods=['POST'])
def delete_account(user_id):
    UserModel.query.filter_by(id=user_id).delete()
    db.session.commit()
    return jsonify({'success': True})
