from flask_sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash
from . import db,app,migrate
import datetime
from sqlalchemy import CheckConstraint
from .views import same_as



class User(db.Model):
	__tablename__ = 'users'
	userID        = db.Column(db.Integer,     primary_key = True)
	email         = db.Column(db.String(100),unique=True)
	pwdhash       = db.Column(db.String(200))
	registered_on_app   = db.Column(db.String(100), nullable=True) 
	role = db.Column(db.String(50), default = 'user')
	read = db.Column(db.Boolean, default = False)
	firstname = db.Column(db.String(100))
	lastname     = db.Column(db.String(100))
	ip_address = db.Column(db.String(200))
	phone = db.Column(db.String(15), nullable = True)
	customer_ID = db.Column(db.String, nullable=True, default = None)
	card_country = db.Column(db.String, nullable = True, default = None)
	card_last4 = db.Column(db.String, nullable = True, default = None)
	card_exp_year = db.Column(db.String, nullable = True, default = None)
	card_brand = db.Column(db.String, nullable = True, default = None)

	def __init__(self, email, password, role='user'):
		self.email = email.lower().strip()
		self.set_password(password)
		self.authenticated = False
		self.admin_authorization = False
		self.role = role
		self.read = False
		self.customer_ID = None
		self.card_country = None
		self.card_last4 = None
		self.card_exp_year = None
		self.card_brand = None
   
		

	def set_password(self, password):
		self.pwdhash = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.pwdhash, password)

	def is_authenticated(self):
	#"""Return True if the user is authenticated."""
		return self.authenticated
		

	def is_anonymous(self):
	#"""Always False, as anonymous users aren't supported."""
		return False

	def is_active(self):
	#"""Always True, as all users are active."""
		return True

	def get_id(self):
	#"""Return the email address to satisfy Flask-Login's requirements."""
	#"""Requires use of Python 3"""
		return str(self.userID)


######TOKEN FOR ACCESS HANDLING##########################

class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))
    
    def add(self):
        db.session.add(self)
        db.session.commit()
    
    @classmethod
    def is_jti_blacklisted(cls, jti):
		query = cls.query.filter_by(jti = jti).first()
		return bool(query)

#####################################################################################################


class Joinmail(db.Model):
   __tablename__ = 'joinmail'
   joinmail_ID = db.Column(db.Integer,    primary_key = True)
   email = db.Column(db.String(100), nullable = False, unique=True)
   def __init__(self, email):
      self.email = email

class Media(db.Model):
	__tablename__ = 'media'
	media_ID = db.Column(db.Integer,    primary_key = True) 
	url = db.Column(db.String,     nullable=False)
	def __init__(self, url):
		self.url = url

class Gallery(db.Model):
	__tablename__ = 'gallery'
	gallery_ID = db.Column(db.Integer,    primary_key = True)
	img_url = db.Column(db.String, nullable = False)
	def __init__(self, img_url):
		self.img_url = img_url


class Blogs(db.Model):
    __tablename__ = 'blogs'
    #__searchable__ = ['topic_Name']
    blog_ID  = db.Column(db.Integer,    primary_key = True)
    blog_topic = db.Column(db.String(5000), nullable = False, unique = True)
    blog_desc = db.Column(db.String)
    category = db.Column(db.String, nullable = True, default='all_categories')
    img_url = db.Column(db.String,     nullable=True, default=None)
    date = db.Column(db.String, nullable=False)
    visits = db.Column(db.Integer, nullable = True, default = 0)
    def __init__(self, blog_topic, blog_desc, date):
        self.blog_topic = blog_topic
        self.blog_desc = blog_desc
        self.date = date
        self.img_url = None
        self.display = False
        self.visits = 0
    def __unicode__(self):
        return self.blog_topic
    def __repr__(self):
        return '{}'.format(self.blog_topic)








class Events(db.Model):
    __tablename__ = 'events'
    #__searchable__ = ['topic_Name']
    event_ID  = db.Column(db.Integer,    primary_key = True) 
    name = db.Column(db.String(4000), nullable = False, unique = True)
    date = db.Column(db.String, nullable = False)
    disable = db.Column(db.Boolean, nullable = True, default = True)
    desc = db.Column(db.String(10000), nullable = True, default = None)  
    price = db.Column(db.Integer, default = 0)
    inventory = db.Column(db.Integer, default = 0)
    mainimage = db.Column(db.String,     nullable=True, default=None)
    taxable = db.Column(db.Boolean, nullable = True, default = False)
    def __init__(self, name, date):
        self.name = name
        self.date = date
        self.disable = True
        self.desc = None
        self.price = 0
        self.inventory = 0
        self.mainimage = None
        self.taxable = False




class Cart(db.Model):
	__tablename__='cart'
	cart_ID = db.Column(db.Integer, primary_key = True)
	user_ID = db.Column(db.Integer, db.ForeignKey('users.userID',ondelete='CASCADE'))
	event_ID =db.Column(db.Integer, db.ForeignKey('events.event_ID',ondelete='SET NULL'))
	amount = db.Column(db.Integer)
	def __init__(self, user_ID, event_ID, amount):
		self.user_ID = user_ID
		self.product_ID =product_ID
		self.amount = amount



class Sales(db.Model):
	__tablename__ ='sales'
	sale_ID = db.Column(db.Integer, primary_key = True)
	user_ID = db.Column(db.Integer, db.ForeignKey('users.userID',ondelete='CASCADE'))
	firstname = db.Column(db.String(50))
	lastname = db.Column(db.String(50))
	email = db.Column(db.String(40))
	total = db.Column(db.Float)
	subtotal = db.Column(db.Float)
	charge_id = db.Column(db.String(100), default = None)
	refunded = db.Column(db.Boolean, default = False)
	date = db.Column(db.String(100), nullable = False) 
	month = db.Column(db.String(100), nullable = False) 
	year = db.Column(db.String(100) , nullable = False)
	invoice = db.Column(db.String(200), default = None)
	def __init__(self, user_ID, firstname, lastname, email, total, subtotal, date, month, year):
		self.user_ID = user_ID
		self.firstname = firstname
		self.lastname = lastname
		self.email = email	
		self.total = total
		self.subtotal = subtotal
		self.charge_id = None
		self.refunded = False
		self.date = date
		self.month = month
		self.year = year
		self.invoice = None


class Invoices(db.Model):
	__tablename__='invoices'
	invoice_ID = db.Column(db.Integer, primary_key = True)
	sale_ID = db.Column(db.Integer, db.ForeignKey('sales.sale_ID',ondelete='CASCADE'))
	event_ID = db.Column(db.Integer)
	event_name = db.Column(db.String(500))
	price = db.Column(db.Float)
	amount = db.Column(db.Integer)
	def __init__(self, sale_ID, event_ID, event_name, price, amount):
		self.sale_ID = sale_ID
		self.event_ID = event_ID
		self.event_name = event_name
		self.price = price
		self.amount = amount




class Contact(db.Model):
	__tablename__ = 'contact'
	contact_ID = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(30), nullable = False)
	email = db.Column(db.String, nullable = False)
	message = db.Column(db.String, nullable = False)
	date = db.Column(db.String)
	read = db.Column(db.Boolean, default=False)
	def __init__(self, name, email, message, date):
		self.name = name
		self.email = email
		self.message = message
		self.date = date
		self.read = False




