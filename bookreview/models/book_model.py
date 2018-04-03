from bookreview.models import db
from bookreview.models.base_model import BaseModel


class BookModel(db.Model, BaseModel):
    __tablename__ = 'book'
    author = db.Column(db.String, index=True)
    title = db.Column(db.String, index=True)
    isbn = db.Column(db.String, unique=True)
    description = db.Column(db.String)
    cover_art_url = db.Column(db.String)

    def __init__(self, author, description, isbn, title, cover_art_url=None):
        self.author = author
        self.description = description
        self.isbn = isbn
        self.title = title
        self.cover_art_url = cover_art_url

    @classmethod
    def get_book_by_title(cls, title):
        return cls.query.filter_by(title=title).first()

    @classmethod
    def get_books_by_author(cls, author):
        return cls.query.filter_by(author=author).all()

    @classmethod
    def get_paginated_books(cls, offset=None, limit=None):
        book_query = cls.query.order_by(cls.title.asc())
        total = book_query.count()
        if offset:
            book_query = book_query.offset(offset)
        if limit:
            book_query = book_query.limit(limit)
        return {
            'books': book_query.all(),
            'total': total
        }

    def to_dict(self):
        return {
            'book_id': self.id,
            'author': self.author,
            'title': self.title,
            'isbn': self.isbn,
            'description': self.description,
            'cover_art_url': self.cover_art_url
        }
