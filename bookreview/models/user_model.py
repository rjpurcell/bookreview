import bcrypt

from bookreview.models import db
from bookreview.models.base_model import BaseModel


class UserModel(BaseModel):
    __tablename__ = 'user'
    username = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String)

    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

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
