from flask_restful import Resource, reqparse
from .models import Media, User, RevokedTokenModel, Gallery, Events, Blogs, Contact
from .email import  send_contact_message, contact_confirmation_email
from .views import get_month_name, date_now
from sqlalchemy import exc, func, cast, DATE, or_
from flask import request, session, redirect, url_for, flash, g,json,jsonify,abort, Response
from . import db
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
import stripe








reg = reqparse.RequestParser()
reg.add_argument('firstname', required = True)
reg.add_argument('lastname', required = True)
reg.add_argument('email', required = True)
reg.add_argument('password', required = True)
reg.add_argument('phone', required = True)

#Only these threee fields for User should be okay.
class UserRegistration(Resource):
 def post(self):
        try:
            data = reg.parse_args()
            if (User.query.filter_by(email=data['email']).first()):
                return {'message': 'User {} already exists'. format(data['email'])}

            new_user = User(email = data['email'], password = data['password'], phone = data['phone'])
            new_user.registered_on_app = date_now()
            new_user.firstname = data['firstname']
            new_user.lastname = data['lastname']
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity = data['email'])
            refresh_token = create_refresh_token(identity = data['email'])
            return{
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
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['email'])}      
        if current_user.check_password(data['password']):
            access_token = create_access_token(identity = data['email'])
            refresh_token = create_refresh_token(identity = data['email'])
            return {
                'userID': current_user.userID,
                'message': 'Logged in as {}'.format(current_user.email),
                'email': current_user.email,
                'firstname': current_user.firstname,
                'lastname' : current_user.lastname,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'phone': current_user.phone
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

class EventsResource(Resource):
    def get(self):    
        events = Events.query.all()
        response = {'events': []}
        for data in events:
            response['events'].append({
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
        return response
        

contact_arguments = reqparse.RequestParser()
contact_arguments.add_argument('email', required = True)
contact_arguments.add_argument('name',  required = True)
contact_arguments.add_argument('message', required = True)

class ContactForm(Resource):
    def post(self):
        data = contact_arguments.parse_args()
        question = Contact(str(data['name']), str(data['email']), str(data['message']), date_now())
        db.session.add(question)
        db.session.commit()
        admin = User.query.filter_by(role = 'admin').first()
        send_contact_message(question, admin)
        contact_confirmation_email(data['email'])
        return {'msg': 'Thank you for contacting us we will get back to you soon!! '}


update_profile_arguments = reqparse.RequestParser()
update_profile_arguments.add_argument('email', required = True)
update_profile_arguments.add_argument('firstname', required = True)
update_profile_arguments.add_argument('lastname', required = True)
update_profile_arguments.add_argument('phone', required = True)
class updateProfileForm(Resource):
    @jwt_required
    def post(self):
        data = update_profile_arguments.parse_args()
        if(data):
            current_user = User.query.filter_by(email=data['email']).first()
            current_user.email = data.email
            current_user.firstname = data.firstname
            current_user.lastname = data.lastname
            current_user.phone = data.phone
            db.session.commit()
            return {'msg': 'Your profile was updated successfully!'}

        else:
            return {'msg': 'There seems to be a problem with the network. Please Try again later'}



banking_information_arguments = reqparse.RequestParser()
banking_information_arguments.add_argument('email', required = True)
banking_information_arguments.add_argument('password', required = False)
banking_information_arguments.add_argument('phone', required = False)
banking_information_arguments.add_argument('firstname', required = False)
banking_information_arguments.add_argument('lastname', required = False)
banking_information_arguments.add_argument('card_id', required = True)
banking_information_arguments.add_argument('token_id', required = True)
banking_information_arguments.add_argument('country', required = True)
banking_information_arguments.add_argument('last4', required = True)
banking_information_arguments.add_argument('exp_year', required = True)
banking_information_arguments.add_argument('bran', required = True)

class banking_information(Resource):
   def post():
      try:
        data = banking_information_arguments.parse_args()
        result = {'message':200}
        customer = stripe.Customer.create(
          email= data['email'],
          source= data['token_id']
        )
        current_user = User.query.filter_by(email = data['email']).first()
        if not current_user:
           if data['password']  != '' and data['firstname'] != '' and data['lastname'] != '' and data['phone'] != '':
              current_user = User( email = data['email'], password = data['password'], phone = data['phone'])
              current_user.firstname = data['firstname']
              current_user.lastname = data['lastname']
           else:
              current_user = User(email = data['email'], password = 'xyz123' , phone = 'N/A')
              current_user.firstname = 'N/A'
              current_user.lastname = 'N/A'
 
           db.session.add(current_user)
           db.session.commit()
        current_user.customer_ID = customer.id
        current_user.card_country = data['country']
        current_user.card_last4 = "XXXX-XXXX-XXXX-" + data['last4']
        current_user.card_exp_year = data['exp_year']
        current_user.card_brand = data['brand']
        db.session.commit()
      except stripe.error.InvalidRequestError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.RateLimitError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.AuthenticationError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.APIConnectionError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.StripeError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except Exception as e:
        result['message'] = 401
        db.session.rollback()
        result['message'] = e

      return result




charge_arguments = reqparse.RequestParser()
charge_arguments.add_argument('subtotal', required = True)
charge_arguments.add_argument('total', required = True)
charge_arguments.add_argument('gst', required = True)
charge_arguments.add_argument('cart', required = True)
charge_arguments.add_argument('user_ID', required = True)
class charge(Resource):
    @jwt_required
    def post():
      try:
        data = charge_arguments.parse_args()
        result = {'message':200}
        subtotal = data['subtotal']
        total =  data['total']
        gst = data['gst']

        current_user = User.query.filter_by(userID = data['user_ID']).first()

        sale = Sales(current_user.userID, current_user.firstname, current_user.lastname, current_user.email, total , subtotal, date_now(), month_now(), year_now())
        db.session.add(sale)


        cart = data['cart']
        for ticket in cart:
            event = Events.query.filter_by(event_ID = ticket['ticket_ID']).first()
            event.inventory = event.inventory - ticket['amount']
            invoice = Invoices(sale.sale_ID, event.event_ID, event.event_name, event.price, ticket['amount'])
            db.session.add(invoice)
        

        total = float(total) * 100 #converted into cents
        if total > 50:
          charge = stripe.Charge.create(
              customer= current_user.customer_ID,
              amount=int(total),
              currency= "cad",
              description ='PCCA Charge - Order # ' + str(sale.sale_ID)
             )
          sale.charge_id = charge.id


        db.session.commit()
       


        invoices = Invoices.query.filter_by(sale_ID = sale.sale_ID).all()  
        
        create_pdf(render_template('invoice.html', total=round(total/100,2), special_instructions = special_instructions, invoices = invoices, gst=gst, subtotal=subtotal, invoice_number=sale.sale_ID, 
          shipping_rate=shipping_rate, date=sale.date), "[" + str(sale.sale_ID) + "][invoice].pdf", app.config['INVOICE_FILES_DEST'])
        
        
        if sale.invoice != None:
           os.remove(app.config['INVOICE_FILES_DEST'] + sale.invoice)

        sale.invoice = "[" + str(sale.sale_ID) + "][invoice].pdf"           

   
        db.session.commit()

        admin = User.query.filter_by(role='admin').first()
        #send_invoice(sale, admin)
        send_invoice(sale, current_user)
        
      except stripe.error.InvalidRequestError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.RateLimitError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.AuthenticationError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.APIConnectionError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except stripe.error.StripeError as e:
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        result['message'] = err.get('message')
      except Exception as e:
        db.session.rollback()
        result['message'] = e

      return response