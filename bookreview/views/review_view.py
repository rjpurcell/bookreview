from flask import abort, Blueprint, jsonify, request
from flask_jwt import current_identity, jwt_required
from bookreview.models import db
from bookreview.models.review_model import ReviewModel


review_blueprint = Blueprint('review_view', __name__)


@review_blueprint.route('/review/get/<int:review_id>', methods=['GET'])
def get_review(review_id):
    review = ReviewModel.query.get(review_id)
    if review:
        return jsonify(review.to_dict())
    return jsonify({'error': 'No such review %s' % review_id})


@jwt_required
@review_blueprint.route('/review/add', methods=['POST'])
def add_review():
    user_id = int(request.json['user_id'])
    if user_id != current_identity.id:
        return abort(403)
    book_id = int(request.json['book_id'])
    review_text = request.json['review_text']
    review = ReviewModel(
        book_id=book_id,
        user_id=user_id,
        review=review_text
    ).save()
    return jsonify({'review_id': review.id})


@jwt_required
@review_blueprint.route('/review/edit/<int:review_id>', methods=['PUT'])
def edit_review(review_id):
    review_text = request.json['review_text']
    review = ReviewModel.query.get(review_id)
    if not review:
        return jsonify({'error': 'No such review %s' % review_id})
    if review.user_id != current_identity.id:
        return abort(403)
    review.review = review_text
    review.save()
    return jsonify({'review_id': review.id})


@jwt_required
@review_blueprint.route('/review/remove/<int:review_id>', methods=['POST'])
def remove_review(review_id):
    review = ReviewModel.query.get(review_id)
    if review and review.user_id != current_identity.id:
        return abort(403)
    ReviewModel.query.filter_by(id=review_id).delete()
    db.session.commit()
    return jsonify({'success': True})
