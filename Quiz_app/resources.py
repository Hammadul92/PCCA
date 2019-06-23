from flask_restful import Resource, reqparse
from .models import Media, User, RevokedTokenModel, Gallery, Events, Blogs
from .views import get_month_name, date_now
from sqlalchemy import exc, func, cast, DATE, or_
from flask import request, session, redirect, url_for, flash, g,json,jsonify,abort, Response
from . import db



from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)




reg = reqparse.RequestParser()
reg.add_argument('email', help = 'email Field can not be blank', required = True)
reg.add_argument('password', help = 'Password Field can not be blank', required = True)
reg.add_argument('phone', help = 'Phone number Field can not be blank', required = True)


#Only these threee fields for User should be okay.
class UserRegistration(Resource):
 def post(self):
        data = reg.parse_args()
        if (User.query.filter_by(email=data['email']).first()):
            return {'message': 'User {} already exists'. format(data['email'])}
        
        new_user = User(email = data['email'], password = data['password'], phone = data['phone'])
        new_user.registered_on_app = date_now()

        db.session.add(new_user)
        try:
            db.session.commit()
            access_token = create_access_token(identity = data['email'])
            refresh_token = create_refresh_token(identity = data['email'])
            return {
                'message': 'User {} was created'.format( data['email']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            db.session.rollback()
            return {'message': 'Something went wrong'}, 500




parser = reqparse.RequestParser()
parser.add_argument('email', help = 'Email Field cannot be blank', required = True)
parser.add_argument('password', help = 'Password be blank', required = True)

class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = User.query.filter_by(email=data['email']).first()
        #print(current_user.check_password(data['password']))

        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['email'])}
        
        if current_user.check_password(data['password']):
            access_token = create_access_token(identity = data['email'])
            refresh_token = create_refresh_token(identity = data['email'])
            return {
                'message': 'Logged in as {}'.format(current_user.email),
                'user': current_user.email,
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}


        # self.name = name
        # self.date = date
        # self.disable = True
        # self.desc = None
        # self.price = 0
        # self.inventory = 0
        # self.mainimage = None
        # self.taxable = False


class EventsResource(Resource):
    def get(self):    
        events = Events.query.all()

        if (events):
            eventlist = []
            for data in events:
                eventlist.append({
                    'key': data.event_ID,
                    'name': data.name,
                    'date': data.date,
                    'disable': data.disable,
                    'desc': data.desc, 
                    'price':data.price, 
                    'inventory': data.inventory,
                    'mainimage': data.mainimage,
                    'taxable': data.taxable
                     })
            return jsonify(eventlist)
        else:
            return {'message': 'No Events Coming Up'}


      
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
      
      
      
#FOR SECURE ROUTES ADD @JWT REQUIRED Pretty much like login required
class SecretResource(Resource):
    @jwt_required
    def get(self):
        active_user = get_jwt_identity()
        return {
            'answer': 42
        }




class GalleryImages(Resource):
    def get(self):
        gallery = Gallery.query.order_by(Gallery.gallery_ID.desc()).all()
        response = {'images' : []}
        for pic in gallery:
            response['images'].append({'gallery_ID': pic.gallery_ID, 'img_url': pic.img_url})      
        return response



class BlogPosts(Resource):
    def get(self):
        blogs = Blogs.query.order_by(Blogs.blog_ID.desc()).paginate(1,3,False)
        response = {'blogs' : []}
        for blog in blogs.items:
            response['blogs'].append({'blog_ID': blog.blog_ID, 'img_url': blog.img_url, 
                'blog_topic': blog.blog_topic, 'blog_desc': blog.blog_desc, 
                'category': blog.category, 'date': blog.date, 'visits': blog.visits})      
        return response



