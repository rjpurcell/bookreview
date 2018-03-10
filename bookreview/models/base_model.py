from bookreview.models import db


class BaseModel(object):
    id = db.Column(db.Integer, primary_key=True)

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    def update(self, new_data):
        for key, val in new_data.items():
            if key != 'id':
                setattr(self, key, val)
        return self
