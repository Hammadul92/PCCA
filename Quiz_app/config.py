import os
from dotenv import load_dotenv
import uuid

Base_dir = os.path.abspath(os.path.dirname(__file__))
Top_level_dir = os.path.abspath(os.curdir)
load_dotenv(os.path.join(Base_dir, '.env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    RECAPTCHA_PUBLIC_KEY = '6Ld80pIUAAAAAOte518QLcrODWroqYJOp2eyIZRc'
    RECAPTCHA_PRIVATE_KEY = '6Ld80pIUAAAAAObtBv7Za_pZJ2xEYc1xBI8Xc9pj'
    #STRIPE_SECRET_KEY = ''
    #STRIPE_PUBLISHABLE_KEY = ''
    STRIPE_SECRET_KEY= 'sk_test_St9GesoAavItBjjhJ4vfPPFD00k4dhRzfP'
    STRIPE_PUBLISHABLE_KEY = 'pk_test_eJH3BMV0metBp2P9ifEgdNTb00RuLa5mJw'

    SQLALCHEMY_DATABASE_URI = 'postgresql:///pcca' 
    #SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:paklea536!nse@178.128.231.135/nateralife'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'pcavancouver@gmail.com'
    MAIL_PASSWORD = 'paklah92'
    MAIL_ASCII_ATTACHMENTS = True
    MAIL_DEFAULT_SENDER = 'pcavancouver@gmail.com'
    INVOICE_FILES_DEST = Top_level_dir + '/Quiz_app/static/invoices/'
    UPLOADED_MEDIA_DEST = Top_level_dir + '/Quiz_app/static/media/'

 