from . import app, mail
from flask import url_for, render_template
from flask_mail import Message
from threading import Thread
from itsdangerous import URLSafeTimedSerializer

def send_async_email(app,msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, recipients, html):
    msg = Message(subject, recipients=[recipients])
    msg.html = html
    thr = Thread(target=send_async_email, args=[app,msg])
    thr.start()
    return thr




###############################################################################   Invoices   ##################################################################################################

def send_invoice(sale, user):
    msg = Message('NSE Order Confirmation', recipients=[user.email])
    msg.html = render_template('email.html', user = user, type = 'confirm_order')
    if sale.invoice != None: 
     with app.open_resource(app.config['INVOICE_FILES_DEST'] + sale.invoice) as fp:
        msg.attach(sale.invoice, "application/pdf", fp.read())
    mail.send(msg)


def send_status_email(user, order_number, tracking_number):
    html = render_template('email.html', user = user, order_number = order_number, tracking_number = tracking_number, type="status") 
    send_email('Naturally Splendid Order Status Changed', user.email, html)
################################################################################################################################################################################################
    

def password_reset_email(user):
    confirm_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    password_reset_url = url_for(
        'reset_password_email',
        token=confirm_serializer.dumps(user.email, salt='too-too-too-salty-for-confirmation'),
        _external=True)
    html = render_template('email.html', password_reset_url=password_reset_url, user=user.email, type="reset_password")
 
    send_email('Password Reset For NSE Account', user.email, html)

def send_contact_message(contact , admin):
    html = render_template('email.html', contact = contact, type="contact_message") 
    send_email('Client/Other Queries', admin.email, html)

def contact_confirmation_email(email):
    html = render_template('email.html', type="contact_confirmation") 
    send_email('NSE Contact', email, html)
