from flask import jsonify, request
from bookreview import app
from bookreview.models import db
from bookreview.models.review_model import BookModel


@app.route('/book/get/<int:book_id>', methods=['GET'])
def get_book(review_id):
    book = BookModel.query.get(review_id)
    if book:
        return jsonify(book.to_dict())
    return jsonify({'error': 'No such review %s' % review_id})


@app.route('/book/add', methods=['POST'])
def add_book():
    author = int(request.json['author'])
    title = int(request.json['title'])
    isbn = request.json['isbn']
    description = request.json['description']
    book = BookModel(
        author=author,
        description=description,
        isbn=isbn,
        title=title
    ).save()
    return jsonify({'book_id': book.id})


@app.route('/book/edit/<int:book_id>', methods=['PUT'])
def edit_book(book_id):
    book_dict = dict(request.json['review_text'])
    book = BookModel.query.get(book_id)
    if not book:
        return jsonify({'error': 'No such book %s' % book_id})
    book.update(**book_dict).save()
    return jsonify({'book_id': book.id})


@app.route('/book/remove/<int:book_id>', methods=['POST'])
def remove_book(book_id):
    BookModel.query.get(book_id).delete()
    db.session.commit()
    return jsonify({'success': True})
