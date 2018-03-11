from flask import Blueprint, jsonify, request
from flask_jwt import current_identity, jwt_required

from bookreview.lib.s3_utils import upload_image
from bookreview.models import db
from bookreview.models.user_model import UserModel


account_blueprint = Blueprint('account_view', __name__)


def email_taken(user, email):
    if not email:
        return False
    existing_user = UserModel.get_user_by_email(email)
    if existing_user and user.id != existing_user.id:
        return True
    return False


def username_taken(user, username):
    if not username:
        return False
    existing_user = UserModel.get_user_by_username(username)
    if existing_user and user.id != existing_user.id:
        return True
    return False


@account_blueprint.route('/account/get/<int:user_id>', methods=['GET'])
def get_account(user_id):
    user = UserModel.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'error': 'No such user'})


@account_blueprint.route('/account/create', methods=['POST'])
def create_account():
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')
    about_me = request.form.get('about_me')
    profile_pic = request.files.get('profile_pic')

    profile_pic_url=None
    if profile_pic:
        profile_pic_url = upload_image(profile_pic)

    user = UserModel(
        username, email, password, about_me=about_me, profile_pic=profile_pic_url
    )
    if not username_taken(user, username) and not email_taken(user, email):
        user.save()
        return jsonify(user.to_dict())

    error = {
        'errorMessages': []
    }
    if username_taken(user, username):
        error['errorMessages'].append('Username is already taken')
        error['invalidUsername'] = True
    if email_taken(user, email):
        error['errorMessages'].append('Email address is already taken')
        error['invalidEmail'] = True

    response = jsonify(error)
    response.status_code = 401
    return response


@jwt_required
@account_blueprint.route('/account/edit', methods=['POST'])
def edit_account():
    password = request.form.pop('password')
    profile_pic = request.files.get('profile_pic')

    user_details = dict(request.form)

    if email_taken(current_identity, request.json.get('email')):
        response = jsonify({'error': 'Email address already taken'})
        response.status_code = 400
        return response

    if username_taken(current_identity, request.json.get('username')):
        response = jsonify({'error': 'Username already taken'})
        response.status_code = 400
        return response

    if password:
        current_identity.update_password(password)

    if profile_pic:
        user_details['profile_pic_url'] = upload_image(profile_pic)

    current_identity.update(user_details).save()

    return jsonify(current_identity.to_dict())


@account_blueprint.route('/account/delete/<int:user_id>', methods=['POST'])
def delete_account(user_id):
    UserModel.query.filter_by(id=user_id).delete()
    db.session.commit()
    return jsonify({'success': True})
