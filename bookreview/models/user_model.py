import bcrypt
from sqlalchemy import or_

from bookreview.models import db
from bookreview.models.base_model import BaseModel


class UserModel(BaseModel):
    __tablename__ = 'user'
    username = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def verify_password(self, password):
        pw_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            self.password_hash.encode("utf-8")
        )
        return pw_hash == self.password_hash

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

    def to_dict(self):
        return {
            'user_id': self.id,
            'username': self.username,
            'email': self.email,
            'friends': UserFriend.get_user_friends(self.id)
        }


class UserFriend(BaseModel):
    __tablename__ = 'user_friend'
    user_id_1 = db.Column(db.Integer, index=True)
    user_id_2 = db.Column(db.Integer, index=True)
    __table_args__ = (
        db.UniqueConstraint('user_id_1', 'user_id_2', name='_user_pair_uc'),
    )

    @classmethod
    def get_user_friends(cls, user_id):
        user_pairs = cls.query.filter(
            or_(cls.user_id_1 == user_id, cls.user_id_2 == user_id)
        ).all()
        users = []
        for up in user_pairs:
            if user_id == up.user_id_1:
                users.append(up.user_id_2)
            else:
                users.append(up.user_id_1)
        return users
