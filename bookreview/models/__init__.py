from flask_sqlalchemy import SQLAlchemy

from bookreview import app

db = SQLAlchemy(app)

# Imports here allow for flask migrate to auto-detect database structures.
from bookreview.models.book_model import BookModel
from bookreview.models.user_model import UserModel
from bookreview.models.review_model import ReviewModel
