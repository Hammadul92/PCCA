
function variational_price(s1,s2,s3){
     var s1 = document.getElementById(s1);
     var s2 = document.getElementById(s2);
     data = {'size': s1.value}
     s2.innerHTML = "";
     $.ajax({
      type : "POST",
      url: '/product/detail/'+s3,
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result){
    
        if(result.old_price > result.price){
          s2.innerHTML = "$ <strike>" + result.old_price + "</strike>" + result.price + " " + result.currency;
        }else{
          s2.innerHTML = "$ " + result.price + " " + result.currency;
        }
        
      }
      });

      
}

function add_to_cart(s1, s2){
      var size = document.getElementById(s1);
      var amount = document.getElementById('cart_value');
      if(size.value == ""){
         alert("Select size for pricing");
         
      }else{
         display('overlay_save');
      }
      data = {'amount': amount.value, 'size': size.value}
      $.ajax({
      type : "POST",
      url: '/buy/'+s2,
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
         window.location.reload();
      }
       
    });
}

function direct_cart(s2){
      $.ajax({
      type : "POST",
      url: '/direct_cart/'+ s2,
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
         amount_cart();   
         window.location.reload();     
      }

      });
}

function glowme(s1, product_id){
  element = document.getElementById(s1);
  rating_element = document.getElementById('rating_score');
  if (s1 == 'star_1'){
     document.getElementById('star_2').classList.remove('checked');
     document.getElementById('star_3').classList.remove('checked');
     document.getElementById('star_4').classList.remove('checked');
     document.getElementById('star_5').classList.remove('checked');
     element.classList.add('checked');
     rating_element.value = 1;
  }
  if (s1 == 'star_2'){
     document.getElementById('star_1').classList.add('checked');
     element.classList.add('checked');
     document.getElementById('star_3').classList.remove('checked');
     document.getElementById('star_4').classList.remove('checked');
     document.getElementById('star_5').classList.remove('checked');
     element.classList.add('checked');
     rating_element.value = 2;
  }
  if (s1 == 'star_3'){
     document.getElementById('star_1').classList.add('checked');
     document.getElementById('star_2').classList.add('checked');
     element.classList.add('checked');
     document.getElementById('star_4').classList.remove('checked');
     document.getElementById('star_5').classList.remove('checked');
     element.classList.add('checked');
     rating_element.value = 3;
  }
  if (s1 == 'star_4'){
     document.getElementById('star_1').classList.add('checked');
     document.getElementById('star_2').classList.add('checked');
     document.getElementById('star_3').classList.add('checked');
     element.classList.add('checked');
     document.getElementById('star_5').classList.remove('checked');
     rating_element.value=4;
  }
  if (s1 == 'star_5'){
     document.getElementById('star_1').classList.add('checked');
     document.getElementById('star_2').classList.add('checked');
     document.getElementById('star_3').classList.add('checked');
     document.getElementById('star_4').classList.add('checked');
     element.classList.add('checked');
     rating_element.value = 5
  }
}

function submit_glowme(rating_score, rating_email, rating_name, rating_title, rating_comment, category, product_id){
      score = document.getElementById(rating_score).value;
      
      title = document.getElementById(rating_title).value;
      if (title == ""){
          document.getElementById('title_error').innerHTML = "Title Required";
      }

      email = document.getElementById(rating_email).value;
      if (email == ""){
        document.getElementById('email_error').innerHTML = "Email Id Required";
      }

      name = document.getElementById(rating_name).value;
      if (name == ""){
        document.getElementById('name_error').innerHTML = "Name Required";
      }

      comment = document.getElementById(rating_comment).value;
      if (comment == ""){
        document.getElementById('comment_error').innerHTML = "Your feedback required";
      }

      if (comment == "" || name == "" || email == "" || title ==""){
        return;
      }

      feedback_message_element = document.getElementById('feedback_message');
      feedback_form_element = document.getElementById('feedback_form');
      data = {'score': score, 'email': email, 'name':name, 'title':title, 'comment': comment, 'category' : category, 'product_id': product_id}
      $.ajax({
      type : "POST",
      url: '/productfeedback',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        feedback_message_element.style.display = "block";
        feedback_form_element.style.display = "none";
      }
      });
}

function submit_glowme_blog(rating_score, rating_email, rating_name, rating_title, rating_comment, category, blog_id){
      score = document.getElementById(rating_score).value;
      
      title = document.getElementById(rating_title).value;
      if (title == ""){
          document.getElementById('title_error').innerHTML = "Title Required";
      }

      email = document.getElementById(rating_email).value;
      if (email == ""){
        document.getElementById('email_error').innerHTML = "Email Id Required";
      }

      name = document.getElementById(rating_name).value;
      if (name == ""){
        document.getElementById('name_error').innerHTML = "Name Required";
      }

      comment = document.getElementById(rating_comment).value;
      if (comment == ""){
        document.getElementById('comment_error').innerHTML = "Your feedback required";
      }

      if (comment == "" || name == "" || email == "" || title ==""){
        return;
      }

      feedback_message_element = document.getElementById('feedback_message');
      feedback_form_element = document.getElementById('feedback_form');
      data = {'score': score, 'email': email, 'name':name, 'title':title, 'comment': comment, 'category' : category, 'blog_id': blog_id}
      $.ajax({
      type : "POST",
      url: '/blogfeedback',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        feedback_message_element.style.display = "block";
        feedback_form_element.style.display = "none";
      }
      });
}





function change_currency(currency){
   data = {'currency': currency}
   $.ajax({
      type : "POST",
      url: '/change_currency',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        display('overlay_save');
        window.location.reload()
       }
      });
      
}




function populate(s1,s2){
      var s1 = document.getElementById(s1);
      var s2 = document.getElementById(s2);
      s2.innerHTML = "";
      data = {'country_name': s1.value}
      $.ajax({
      type : "POST",
      url: '/get_provinces',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        var optionArray = result.provinces;
        for(var option in optionArray){
        var pair = optionArray[option].split("|");
        var newOption = document.createElement("option");
        newOption.value = pair[0];
        newOption.innerHTML = pair[1];
        s2.options.add(newOption);
       }
     }
      });
      
}

function populate2(s1,s2){
      var s1 = document.getElementById(s1);
      var s2 = document.getElementById(s2);
      //s2.innerHTML = "";
      data = {'country_name': s1.value}
      $.ajax({
      type : "POST",
      url: '/get_provinces',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        var optionArray = result.provinces;
        for(var option in optionArray){
          var pair = optionArray[option].split("|");
          var newOption = document.createElement("option");
          newOption.value = pair[0];
          newOption.innerHTML = pair[1];
          s2.options.add(newOption);
        }
      }
      });
      
}


function subscribe(email, message){
  var email_field = document.getElementById(email);
  var message_area = document.getElementById(message);
  message_area.style.display = 'block';
  data = {'email': email_field.value}
  $.ajax({
      type : "POST",
      url: '/subscribe',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          message_area.innerHTML = result.message
      }
  });

}


function makePayment(subtotal, totalcents, gst, coupon_name, total_discount, shipping_rate){
        special_instructions = document.getElementById('saved_instructions').value;
        data = {'subtotal':subtotal, 'total' : totalcents, 'gst':gst, 'coupon_name':coupon_name, 'total_discount': total_discount, 'special_instructions':special_instructions, 'shipping_rate':shipping_rate}
        $.ajax({
           type : "POST",
           url: '/charge',
           data: JSON.stringify(data),
           contentType: 'application/json;charset=UTF-8',
           success: function(result){
               window.location.href = "/checkout";
           }
        });        

}




function amount_cart(){

  $.ajax({
      type : "POST",
      url: '/amount_cart',
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
            document.getElementById('cart_amount').innerHTML= result.number_of_items;
      }            
      });  

}



window.onload = function() {

   
      amount_cart();
   

     $.ajax({
      type : "POST",
      url: '/get_brands',
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          for (var i = 0; i < result.brands.length; i++){
              $('#brands').append("<li><a href='/brand/"+result.brands[i][0]+"'>" + result.brands[i][1] + "</a></li>");
              $('#brands_footer').append("<li><a href='/brand/"+result.brands[i][0]+"'>" + result.brands[i][1] + "</a></li>");
          }
      }
      });  

     $.ajax({
      type : "POST",
      url: '/get_biotechs',
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          for (var i = 0; i < result.biotechs.length; i++){
              $('#biotech').append("<li><a href='/biotech/"+result.biotechs[i]+"'>" + result.biotechs[i] + "</a></li>");
               $('#biotech_footer').append("<li><a href='/biotech/"+result.biotechs[i]+"'>" + result.biotechs[i] + "</a></li>");
          }

      }
      });  

      $.ajax({
      type : "POST",
      url: '/get_about',
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          for (var i = 0; i < result.about.length; i++){
              $('#about').append("<li><a href='/about/"+result.about[i]+"'>" + result.about[i] + "</a></li>");
          }

          $('#about_main').attr("href", "/about/" + result.about[0]);
          $('#about_footer').attr("href", "/about/" + result.about[0])
      }
      });  

      
      populate2('country','province');  
   


};