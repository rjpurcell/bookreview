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


@review_blueprint.route('/review/list/<int:book_id>', methods=['GET'])
def list_reviews(book_id):
    offset = int(request.args['offset'])
    limit = int(request.args['limit'])
    review_details = ReviewModel.get_reviews_for_book(
        book_id, limit=limit, offset=offset
    )
    return jsonify({
        'reviews': [rev.to_dict() for rev in review_details['reviews']],
        'total': review_details['total'],
        'offset': offset,
        'limit': limit
    })


@review_blueprint.route('/review/add', methods=['POST'])
@jwt_required()
def add_review():
    book_id = int(request.json['book_id'])
    review_text = request.json['review_text']
    review = ReviewModel(
        book_id=book_id,
        user_id=current_identity.id,
        review=review_text
    ).save()
    return jsonify({'review_id': review.id})


@review_blueprint.route('/review/edit/<int:review_id>', methods=['PUT'])
@jwt_required()
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


@review_blueprint.route('/review/remove/<int:review_id>', methods=['POST'])
@jwt_required()
def remove_review(review_id):
    review = ReviewModel.query.get(review_id)
    if review and review.user_id != current_identity.id:
        return abort(403)
    ReviewModel.query.filter_by(id=review_id).delete()
    db.session.commit()
    return jsonify({'success': True})
