import bcrypt

from bookreview.models import db
from bookreview.models.base_model import BaseModel


class UserModel(db.Model, BaseModel):
    __tablename__ = 'user'
    username = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String)
    about_me = db.Column(db.String)
    profile_pic_url = db.Column(db.String)

    def __init__(self, username, email, password, about_me=None, profile_pic=None):
        self.username = username
        self.email = email
        self._set_password(password)
        self.profile_pic_url = profile_pic
        self.about_me = about_me

    @classmethod
    def authenticate(cls, username, password):
        user = cls.get_user_by_username(username)
        if user.verify_password(password):
            return user

    @classmethod
    def identity(cls, payload):
        user_id = payload['identity']
        return cls.query.get(user_id)

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

    def _set_password(self, password):
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

    def update_password(self, password):
        if not self.verify_password(password):
            self._set_password(password)

    def to_dict(self):
        return {
            'user_id': self.id,
            'username': self.username,
            'email': self.email,
            'about_me': self.about_me,
            'profile_pic': self.profile_pic_url
        }
