import bcrypt

from bookreview.models import db
from bookreview.models.base_model import BaseModel


class UserErrors:
    """
    A collection of JWT consumable stub objects to be returned in place of
    and actual user in the case of an error in identity() or authenticate().
    """
    class ErrorObject:
        # JWT identity objects need a truthy id attribute
        id = -1
        def __init__(self, enum_val):
            self.enum_val = enum_val

    USERNOTFOUND = ErrorObject(1)
    INVALIDPASSWORD = ErrorObject(2)


class UserModel(db.Model, BaseModel):
    __tablename__ = 'br_user'
    username = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String)
    password_salt = db.Column(db.LargeBinary)
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
        if not user:
            return UserErrors.USERNOTFOUND
        if user.verify_password(password):
            return user
        return UserErrors.INVALIDPASSWORD

    @classmethod
    def identity(cls, payload):
        user_id = payload['identity']
        user = cls.query.get(user_id)
        if not user:
            return UserErrors.USERNOTFOUND
        return user

    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def verify_password(self, password):
        pw_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            self.password_salt
        ).decode()
        return pw_hash == self.password_hash

    def _set_password(self, password):
        self.password_salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            self.password_salt
        ).decode()

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
