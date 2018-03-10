from bookreview.models import db
from bookreview.models.base_model import BaseModel
from bookreview.models.book_model import BookModel
from bookreview.models.user_model import UserModel


class ReviewModel(db.Model, BaseModel):
    __tablename__ = 'review'
    user_id = db.Column(db.Integer, db.ForeignKey('br_user.id'), index=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), index=True)
    review = db.Column(db.String)

    def __init__(self, review, user_id, book_id):
        self.user_id = user_id
        self.book_id = book_id
        self.review = review

    @classmethod
    def create_review(cls, review, title, username):
        book = BookModel.get_book_by_title(title)
        user = UserModel.get_user_by_username(username)
        return cls(review, user.id, book.id)

    def to_dict(self):
        return {
            'review_id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'review_text': self.review
        }
