from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, SubmitField, TextField, BooleanField, PasswordField, SelectField, FieldList, RadioField, FormField,HiddenField
from wtforms.validators import DataRequired, Email, Length, EqualTo, AnyOf, Regexp, Required, Optional
#from wtforms_components import If
from flask_wtf.file import FileField, FileRequired, FileAllowed
from flask_wtf.recaptcha import RecaptchaField



#phone numbers currently accepting canadian format with regexp and can be changed for international format
#Can also apply Length(min=10, max=15) format to phone numbers


class ContactForm(FlaskForm):
	email = TextField('Email',validators=[DataRequired("Please enter email."), Email("Please enter valid email address.")])
	name = TextField('Name', validators=[DataRequired("Please enter your name.")] )
	message = TextAreaField('Message', validators=[DataRequired('Please write down your message.')])
	recaptcha = RecaptchaField()
	submit = SubmitField('Contact')

class LoginForm(FlaskForm):
  email = StringField('Email', validators=[DataRequired("Please enter your email address."), Email("Please enter valid email address.")])
  password = PasswordField('Password', validators=[DataRequired("Please Enter Your Account Password.")])
  submit = SubmitField("Login")

class PasswordResetForm(FlaskForm):
	email = StringField('Email:', validators=[DataRequired("Please enter your email address."), Email("Please enter valid email address.")])
	submit = SubmitField("Submit")

class Password_EmailForm(FlaskForm):
	password = PasswordField('Password', validators=[DataRequired("Please enter a password."), Length(min=6, message="Passwords must be 6 characters or more.")])
	re_password = PasswordField('Confirm Password', validators=[DataRequired("Please enter a password."), EqualTo('password',message='Password did not match!')])
	submit = SubmitField("Submit")




class PhotoForm(FlaskForm):
        title =  StringField('Question', validators=[DataRequired('*required')])
        description =  TextAreaField('Question', validators=[DataRequired('*required')])
        photo = FileField('image', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])
        submit = SubmitField('Post')

class SearchForm(FlaskForm):
	search = StringField('search',validators=[DataRequired()])
	submit = SubmitField()



