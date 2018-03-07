from flask import jsonify, request
from bookreview import app
from bookreview.models import db
from bookreview.models.user_model import UserModel


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
    if UserModel.get_user_by_email(email):
        return jsonify({'error': 'Email address already exists'})
    if UserModel.get_user_by_username(username):
        return jsonify({'error': 'Username is already taken'})
    user = UserModel(username, email, password).save()
    return jsonify({'user_id': user.id})


@app.route('/account/delete/<int:user_id>', methods=['POST'])
def delete_account(user_id):
    UserModel.query.filter_by(id=user_id).delete()
    db.session.commit()
    return jsonify({'success': True})
