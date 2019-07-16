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


from flask_cors import CORS, cross_origin

from flask_json import FlaskJSON, JsonError, json_response, as_json

from flask_restful import Api



from flask_jwt_extended import JWTManager


stripe.api_key = Config.STRIPE_SECRET_KEY



app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)
FlaskJSON(app)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blacklisted(jti)




app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_object(Config)
#database using SQLAlchemy and postgresql
db = SQLAlchemy(app)
migrate = Migrate(app, db)
db.init_app(app)

mail = Mail(app)




#flask_login
from .models import User
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message_category = "info"


@login_manager.user_loader #can use session_token instead of user_if for more security
def load_user(userID):
    return User.query.filter(User.userID == int(userID)).first()



from . import routes

import resources

api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/userlogin')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.GalleryImages, '/gallery')
api.add_resource(resources.AboutUs, '/about_us')
api.add_resource(resources.BlogPosts, '/blogs')
api.add_resource(resources.ContactForm, '/contact')
api.add_resource(resources.EventsResource, '/events')
api.add_resource(resources.updateProfileForm, '/updateProfile')
api.add_resource(resources.banking_information, '/banking_information')
api.add_resource(resources.charge, '/charge')
api.add_resource(resources.anonymous_account, '/anonymous_account')