from flask import Blueprint, jsonify, request
from flask_jwt import jwt_required

from bookreview.lib.s3_utils import upload_image
from bookreview.models.book_model import BookModel


book_blueprint = Blueprint('book_view', __name__)


@book_blueprint.route('/book/get/<int:book_id>', methods=['GET'])
def get_book(review_id):
    book = BookModel.query.get(review_id)
    if book:
        return jsonify(book.to_dict())
    return jsonify({'error': 'No such review %s' % review_id})


@jwt_required
@book_blueprint.route('/book/add', methods=['POST'])
def add_book():
    author = int(request.form['author'])
    title = int(request.form['title'])
    isbn = request.form['isbn']
    description = request.form['description']
    cover_art_url = upload_image(request.files['cover_art'])
    book = BookModel(
        author,
        description,
        isbn,
        title
    ).save()
    return jsonify({'book_id': book.id})


@jwt_required
@book_blueprint.route('/book/edit/<int:book_id>', methods=['PUT'])
def edit_book(book_id):
    book_dict = dict(request.form)

    book = BookModel.query.get(book_id)
    if not book:
        return jsonify({'error': 'No such book %s' % book_id})

    cover_art = request.files.get('cover_art')
    if cover_art:
        book_dict['cover_art_url'] = upload_image(cover_art)

    book.update(book_dict).save()
    return jsonify({'book_id': book.id})
