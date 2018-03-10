from bookreview.models import db
from bookreview.models.base_model import BaseModel


class BookModel(db.Model, BaseModel):
    __tablename__ = 'book'
    author = db.Column(db.String, index=True)
    title = db.Column(db.String, index=True)
    isbn = db.Column(db.String, unique=True)
    description = db.Column(db.String)

    def __init__(self, author, description, isbn, title):
        self.author = author
        self.description = description
        self.isbn = isbn
        self.title = title

    @classmethod
    def get_book_by_title(cls, title):
        return cls.query.filter_by(title=title).first()

    @classmethod
    def get_books_by_author(cls, author):
        return cls.query.filter_by(author=author).all()

    def to_dict(self):
        return {
            'book_id': self.id,
            'author': self.author,
            'title': self.title,
            'isbn': self.isbn,
            'description': self.description
        }

    def update(self, **kwargs):
        for keyname, value in kwargs.items():
            setattr(self, keyname, value)
        return self
