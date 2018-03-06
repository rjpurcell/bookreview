from bookreview import app


@app.route('/review/get/<int:review_id>', methods=['GET'])
def get_review(review_id):
    pass


@app.route('/review/add', methods=['POST'])
def get_review(review_id):
    pass


@app.route('/review/edit/<int:review_id>', methods=['GET'])
def get_review(review_id):
    pass


@app.route('/review/remove/<int:review_id>', methods=['GET'])
def get_review(review_id):
    pass
