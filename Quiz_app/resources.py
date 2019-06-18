from flask_restful import Resource, reqparse
from .models import Media, User, RevokedTokenModel
from .views import get_month_name, date_now
from sqlalchemy import exc, func, cast, DATE, or_
from flask import request, session, redirect, url_for, flash, g,json,jsonify,abort, Response
from . import db



from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)




parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)


class UserRegistration(Resource):
 def post(self):
        data = parser.parse_args()
        print(data['username'])
        if (User.query.filter_by(email=data['username']).first()):
            return {'message': 'User {} already exists'. format(data['username'])}
        new_user = User(
            email = data['username'],
            password = data['password']
            
        )
        new_user.registered_on_app = date_now()

        db.session.add(new_user)
       
        #print('Session Committed', new_user.email)
        try:
            db.session.commit()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created'.format( data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            db.session.rollback()
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = User.query.filter_by(email=data['username']).first()
        #print(current_user.check_password(data['password']))

        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}
        
        if current_user.check_password(data['password']):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.email),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}


      
class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500



class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500
      
      
class TokenRefresh(Resource):
    def post(self):
        return {'message': 'Token refresh'}
      
      
class AllUsers(Resource):
    def get(self):
        return User.return_all()

    def delete(self): 
        return {'message': 'Delete all users'}
      
#FOR SECURE ROUTES ADD @JWT REQUIRED Pretty much like login required
class SecretResource(Resource):
    @jwt_required
    def get(self):
        print(get_jwt_identity())
        active_user = get_jwt_identity()
        return {
            'answer': 42
        }









