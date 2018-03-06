from bookreview.models import db


class BaseModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
