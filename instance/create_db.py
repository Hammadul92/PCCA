from Quiz_app import app
from Quiz_app import db
from Quiz_app.models import User, Pages
import sys, os, datetime

if os.path.abspath(os.curdir) not in sys.path:
	sys.path.append(os.path.abspath(os.curdir))

with app.app_context():
	db.drop_all()
	db.create_all()
	#Initializing db with admin
	admin = User(email='info@pcca.com', password='paklah92', role='admin', phone='545454546')
	admin.read = True
	page = Pages('About Us')
	db.session.add(page)
	db.session.add(admin)
	db.session.commit()
	
	
	
