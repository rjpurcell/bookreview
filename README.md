==========
BookReview
==========

Local Setup
===========

# Install Prerequisites

- Install [npm](https://docs.npmjs.com/getting-started/installing-node)
- Install [python3.6](https://www.python.org/downloads/release/latest)
- Install and setup a [virtualenv](https://packaging.python.org/guides/installing-using-pip-and-virtualenv/) for python.
  I'd recommend using [virtualenvwrapper](http://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html) or [pipenv](https://docs.pipenv.org/) instead of `virtualenv` directly, but it's not required.
- Install [postgres](https://www.postgresql.org/download/) with a default user `postgres` and password `postgres` (if you wish to use a different database username/password be sure to update the URI in `config.py`).

# Install requirements
- Change to the root directory of the repository and run
```bash
$ npm install
```
- Activate your `virtualenv` and run
```bash
$ pip install -r requirements.txt
```

# Setup Database
- Run your local postgres server on port `5432`. How you run it will vary based on your operating system.
- Connect to your postgres database and run
```bash
# CREATE DATABASE bookreview WITH OWNER postgres;
```
- With your `virtualenv` activated, run
```bash
$ python app.py db upgrade
```

# Run BookReview
- With your `virtualenv` still activated, start the backend by running
```bash
$ python app.py runserver
```
  This will start the API backend on http://localhost:8080 (to select a different port change `APP_PORT` in `config.py`).
- From the root of the repository directory run
```bash
$ npm start
```
  The frontend should now be available at http://localhost:3000/