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
	air_shipping = db.Column(db.Boolean, default = False)
	read = db.Column(db.Boolean, default = False)
	firstname = db.Column(db.String(100))
	lastname     = db.Column(db.String(100))
	ip_address = db.Column(db.String(200))
	address =db.Column(db.String(500), nullable = True)
	city = db.Column(db.String(100), nullable = True)
	province= db.Column(db.String(100), nullable = True)
	country= db.Column(db.String(100), nullable = True)
	zipcode= db.Column(db.String(100), nullable = True)
	phone = db.Column(db.String(15), nullable = True)
	currency = db.Column(db.String(10), nullable = True, default = 'CAD')
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
		self.air_shipping = False
		self.read = False
		self.currency = 'CAD'
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





class BlogDatabase(db.Model):
    __tablename__ = 'blog_database'
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


class Ambassador(db.Model):
    __tablename__ = 'ambassador'
    #__searchable__ = ['topic_Name']
    ambassador_ID  = db.Column(db.Integer,    primary_key = True)
    ambassador_name = db.Column(db.String(5000), nullable = False, unique = True)
    ambassador_desc = db.Column(db.String, nullable=True)
    brand = db.Column(db.String, nullable = True, default='all_brands')
    ambassador_type = db.Column(db.String, nullable=True, default = "Tri-athlete")
    img_url = db.Column(db.String, nullable=True, default=None)
    fb_url = db.Column(db.String, nullable=True, default= '#')
    web_url = db.Column(db.String, nullable=True, default= '#')
    in_url = db.Column(db.String, nullable=True, default= '#')
    date = db.Column(db.String, nullable=False)
    def __init__(self, ambassador_name, date):
        self.ambassador_name = ambassador_name
        self.date = date






class Products(db.Model):
    __tablename__ = 'product_database'
    #__searchable__ = ['topic_Name']
    product_ID  = db.Column(db.Integer,    primary_key = True) 
    disable = db.Column(db.Boolean, nullable = True, default = True)
    product_name = db.Column(db.String(4000), nullable = False, unique = True)
    product_order = db.Column(db.Integer, default = 1)
    product_desc = db.Column(db.String(10000), nullable = False)  
    product_weight = db.Column(db.String, default = None)
    product_shipping_weight = db.Column(db.String, default=None)
    product_price = db.Column(db.String, default = None)
    discount = db.Column(db.Integer, nullable=True, default = 0)
    inventory = db.Column(db.String, default = None)
    category = db.Column(db.String, nullable = True, default='all_categories')
    subcategory = db.Column(db.String, nullable = True, default ='all_categories')
    L = db.Column(db.String, default=None)
    W = db.Column(db.String, default=None)
    H = db.Column(db.String, default=None)
    bogo = db.Column(db.Boolean, nullable=True, default=False)
    mainimage = db.Column(db.String,     nullable=True, default=None)
    galleryimage1 = db.Column(db.String,     nullable=True, default=None)
    galleryimage2 = db.Column(db.String,     nullable=True, default=None)
    nutritiontable = db.Column(db.String,     nullable=True, default=None)
    taxable = db.Column(db.Boolean, nullable = True, default = True)
    meta_description = db.Column(db.String, nullable = True, default = None)
    def __init__(self, product_name, product_desc):
    	self.disable = True
        self.product_name = product_name
        self.product_order = 1 
        self.product_desc = product_desc
        self.product_weight=None
        self.product_shipping_weight = None
        self.product_price=None
        self.discount = 0
        self.inventory = None
        self.L = None
        self.W = None
        self.H = None
        self.mainimage = None
        self.galleryimage1=None
        self.galleryimage2=None
        self.nutritiontable=None
        self.category = 'all_categories'
        self.subcategory = 'all_categories'



class Coupons(db.Model):
	__tablename__ = 'coupons'
	coupon_ID = db.Column(db.Integer, primary_key = True)
	coupon_name = db.Column(db.String, nullable = False)
	active = db.Column(db.Boolean, nullable = False, default = False)
	all_products = db.Column(db.Boolean, nullable = False, default = False)
	associated_brands = db.Column(db.String, nullable = True, default = None)
	discount_percent = db.Column(db.Integer, nullable = True, default = 0)
	shipping_discount_percent = db.Column(db.Integer, nullable = True, default = 0)
	usage = db.Column(db.Integer, nullable=True, default=0)
	date = db.Column(db.String, nullable=True, default=None)
	def __init__(self, coupon_name):
		self.coupon_name = coupon_name.upper()
		self.active = False
		self.all_products = False



class Category(db.Model):
	__tablename__= "product_category"
	category_ID = db.Column(db.Integer, primary_key = True)
	category_name = db.Column(db.String(500), nullable = False, unique = True)
	subcategories = db.Column(db.String, nullable = True, default = None)
        def __init__(self, category_name):
		self.category_name = category_name
		self.subcategories = None




class Cart(db.Model):
	__tablename__='cart'
	cart_ID = db.Column(db.Integer, primary_key = True)
	user_ID = db.Column(db.Integer, db.ForeignKey('users.userID',ondelete='CASCADE'))
	product_ID =db.Column(db.Integer, db.ForeignKey('product_database.product_ID',ondelete='SET NULL'))
	product_size = db.Column(db.String, nullable = True)
	amount = db.Column(db.Integer)
	def __init__(self, user_ID, product_ID, product_size, amount):
		self.user_ID = user_ID
		self.product_ID =product_ID
		self.product_size = product_size
		self.amount = amount



class Sales(db.Model):
	__tablename__ ='sales'
	sale_ID = db.Column(db.Integer, primary_key = True)
	user_ID = db.Column(db.Integer, db.ForeignKey('users.userID',ondelete='CASCADE'))
	firstname = db.Column(db.String(50))
	lastname = db.Column(db.String(50))
	email = db.Column(db.String(40))
	sale_amount = db.Column(db.Float)
	subtotal = db.Column(db.Float)
	charge_id = db.Column(db.String(100), default = None)
	refunded = db.Column(db.Boolean, default = False)
	date = db.Column(db.String(100), nullable = False) 
	month = db.Column(db.String(100), nullable = False) 
	year = db.Column(db.String(100) , nullable = False)
	invoice = db.Column(db.String(200), default = None)
	packing_slip = db.Column(db.String(200), default = None)
	status = db.Column(db.String, default = 'Received')
	tracking_number = db.Column(db.String, default=None)
	shipping_charge = db.Column(db.Float, default = 0, nullable = True)
	shipping_cost = db.Column(db.Float, default = 0, nullable = True)
	lot_numbers = db.Column(db.String, default = None)
	def __init__(self, user_ID, firstname, lastname, email, sale_amount, subtotal, date, month, year):
		self.user_ID = user_ID
		self.firstname = firstname
		self.lastname = lastname
		self.email = email	
		self.sale_amount = sale_amount
		self.subtotal = subtotal
		self.charge_id = None
		self.refunded = False
		self.date = date
		self.month = month
		self.year = year
		self.invoice = None
		self.packing_slip = None
		self.status = 'Received'
		self.tracking_number = None
		self.shipping_charge = 0
		self.shipping_cost = 0
		self.lot_numbers = None

class Invoices(db.Model):
	__tablename__='invoices'
	invoice_ID = db.Column(db.Integer, primary_key = True)
	sale_ID = db.Column(db.Integer, db.ForeignKey('sales.sale_ID',ondelete='CASCADE'))
	product_ID = db.Column(db.Integer)
	product_name = db.Column(db.String(500))
	category = db.Column(db.String(500))
	price = db.Column(db.Float)
	amount = db.Column(db.Integer)
	def __init__(self, sale_ID, product_ID, product_name, category, price, amount):
		self.sale_ID = sale_ID
		self.product_ID = product_ID
		self.product_name = product_name
		self.category = category
		self.price = price
		self.amount = amount




class Contact(db.Model):
	__tablename__ = 'contact'
	contact_ID = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(30), nullable = False)
	contact_type = db.Column(db.String(30), nullable = True, default = 'Contact')
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
		self.contact_type = 'Contact'




