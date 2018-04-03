from flask import Blueprint, jsonify, request
from flask_jwt import jwt_required

from bookreview.lib.utils import upload_image
from bookreview.models.book_model import BookModel


book_blueprint = Blueprint('book_view', __name__)


@book_blueprint.route('/book/get/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = BookModel.query.get(book_id)
    if book:
        return jsonify(book.to_dict())
    error = jsonify({'error': 'No such review %s' % book_id})
    error.status_code = 403
    return error


@book_blueprint.route('/book/add', methods=['POST'])
@jwt_required()
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


@book_blueprint.route('/book/edit/<int:book_id>', methods=['PUT'])
@jwt_required()
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


@book_blueprint.route('/book/list', methods=['GET'])
def list_reviews():
    offset = int(request.args['offset'])
    limit = int(request.args['limit'])
    books = BookModel.get_paginated_books(
        limit=limit, offset=offset
    )
    return jsonify({
        'books': [book.to_dict() for book in books['books']],
        'total': books['total'],
        'offset': offset,
        'limit': limit
    })
