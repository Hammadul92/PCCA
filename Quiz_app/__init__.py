# import for app
from flask import Flask
from flask_uploads import UploadSet, IMAGES, configure_uploads, patch_request_class
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from config import Config
import stripe
import logging
from logging.handlers import SMTPHandler
from logging.handlers import RotatingFileHandler
import os

#import flask_whooshalchemy as whooshalchemy

#configurtion


app = Flask(__name__)
app.config.from_object(Config)
#database using SQLAlchemy and postgresql
db = SQLAlchemy(app)
migrate = Migrate(app, db)
db.init_app(app)




#flask_whooshalchemy for full text search
#from .models import QuizDatabase
#whooshalchemy.whoosh_index(app, QuizDatabase)
#MAX_SEARCH_RESULTS = 25

#flask_mail

mail = Mail(app)

if not app.debug:
    if app.config['MAIL_SERVER']:
        auth = None
        if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
            auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
        secure = None
        if app.config['MAIL_USE_TLS']:
            secure = ()
        mail_handler = SMTPHandler(
            mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
            fromaddr=app.config['MAIL_USERNAME'],
            toaddrs=app.config['ADMINS'], subject='NSE Application Error',
            credentials=auth, secure=secure)
        mail_handler.setLevel(logging.ERROR)
        mail_handler.setFormatter(logging.Formatter(
		    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
		))
        app.logger.addHandler(mail_handler)


#flask_login
from .models import User
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message_category = "info"


@login_manager.user_loader #can use session_token instead of user_if for more security
def load_user(userID):
    return User.query.filter(User.userID == int(userID)).first()

#@app.route("/")
#def check():
#    return "check"



from . import routes
