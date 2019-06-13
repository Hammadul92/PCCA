 





function populate_categories(s1,s2){
      var s1 = document.getElementById(s1);
      var s2 = document.getElementById(s2);
      s2.innerHTML = "";
      data = {'parent_category': s1.value}
      $.ajax({
      type : "POST",
      url: '/get_subcategories',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        var optionArray = result.subcategories;
        for(var option in optionArray){
        var pair = optionArray[option].split("|");
        var newOption = document.createElement("option");
        newOption.value = pair[0];
        newOption.innerHTML = pair[1];
        s2.options.add(newOption);
      }
        console.log(result);
      }
      });
      
}



function add_brand(coupon_ID, element){

      data = {'value': element.value, 'coupon_ID': coupon_ID}
      $.ajax({
      type : "POST",
      url: '/add_coupon_brands/' + coupon_ID,
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        window.location.reload()
      }
      });
      
}


function add_blog_tags(blog_ID, type_ID){
  var element = document.getElementById(type_ID);
  data = {'value': element.value, 'blog_ID': blog_ID};
  $.ajax({
      type : "POST",
      url: '/add_blog_tags',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        window.location.reload()
      }
  });

}




 function accounts(date, end_date){

     data = {'date': date, 'end_date':end_date};
     $.ajax({
      type : "POST",
      url: '/accounts',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        var accounts = document.getElementById('accounts');

        if (accounts){
            var date_today = document.getElementById("date_today");
            var paid_subtotal = document.getElementById('paid_subtotal');
            var paid_shipping = document.getElementById('paid_shipping');
            var discount = document.getElementById('discount');
            var associated_orders = document.getElementById('associated_orders');
            var paid_total = document.getElementById('paid_total');
            var paid_gst = document.getElementById('paid_gst');
            var data_points = []
            var data_points_subtotal = []
            
            associated_orders.innerHTML = "";
            for(order in result.orders){
               associated_orders.innerHTML += "<span class = 'badge-orders'>" + result.orders[order] + "</span> ";
            }
                
            
            discount.innerHTML = '$ ' + result.discount + ' CAD';  
            date_today.innerHTML = result.date;
            if (result.end_date != ''){
              date_today.innerHTML += '<br/><p><b>To</b></p>' + result.end_date;
            }
            paid_subtotal.innerHTML = '$ ' + result.paid_subtotal + ' CAD';
            paid_shipping.innerHTML = '$ ' + result.paid_shipping + ' CAD';
            paid_total.innerHTML = '$ ' + result.paid_total + ' CAD';
            paid_gst.innerHTML = '$ ' + result.paid_gst + ' CAD';

            var table = document.getElementById("sales_table");
            var rowCount = table.rows.length;
            for (var i = rowCount - 1; i > 0; i--) {
                  table.deleteRow(i);
            }


            for(var val in result){
                if (val != 'date' && val != 'end_date' && val != 'orders' && val != 'paid_subtotal' && val != 'paid_shipping' && val != 'discount' && val!='paid_gst' && val!='paid_total'){
                  data_points.push({label: val, y: result[val].sales}) 
                  data_points_subtotal.push({label: val, y: result[val].subtotal})

                  var row = table.insertRow(-1);
                  th1 = document.createElement('th');
                  th2 = document.createElement('th');
                  th3 = document.createElement('th');
                  th4 = document.createElement('th');
                  th1.innerHTML = "<h6><b>"+val+"</b></h6>";
                  row.appendChild(th1); 
                  row.appendChild(th2);
                  row.appendChild(th3); 
                  row.appendChild(th4);

                  var row2 = table.insertRow(-1);
                  var cell1 = row2.insertCell(0);
                  var cell2 = row2.insertCell(1);
                  var cell3 = row2.insertCell(2);
                  var cell4 = row2.insertCell(3);
                  cell1.innerHTML = '<b>Name</b>';
                  cell2.innerHTML = '<b>Quantity</b>';
                  cell3.innerHTML = '<b>Price</b>';
                  cell4.innerHTML = '<b>Subtotal</b>';

                  for(var item in result[val].items){
                     var row = table.insertRow(-1);
                     var cell1 = row.insertCell(0);
                     var cell2 = row.insertCell(1);
                     var cell3 = row.insertCell(2);
                     var cell4 = row.insertCell(3);
                     cell1.innerHTML = item;
                     cell2.innerHTML = result[val].items[item].amount;
                     cell3.innerHTML = result[val].items[item].price;
                     cell4.innerHTML = result[val].items[item].subtotal;
                  }            
                  
                }
                
            }


            var chart = new CanvasJS.Chart("chartContainer", {
              theme: "light1", // "light2", "dark1", "dark2"
              animationEnabled: true, // change to true    
              title:{
                text: 'Number Of Items Sold',
                fontSize: 14
              },
              data: [
                {
                  // Change type to "bar", "area", "spline", "pie",etc.
                  type: "column",
                  dataPoints: data_points
                }
              ]
            });
            chart.render();

            var chart_subtotal = new CanvasJS.Chart("sales_subtotal", {
              theme: "light1",
              animationEnabled: true, // change to true    
              title:{
                text: 'Sales Subtotal (CAD - $)',
                fontSize: 14
              },
              data: [
                {
                  // Change type to "bar", "area", "spline", "pie",etc.
                  type: "column",
                  dataPoints: data_points_subtotal
                }
              ]
            });
            chart_subtotal.render();
         } //accounts



      } //success

    });  //ajax
   
}



function change_accounts_date(date, end_date){
  if(end_date == ''){
    if(date==''){
      var today = new Date();
      date = today
    }

  }
  else{
    date = document.getElementById(date).value;
    end_date = document.getElementById(end_date).value;
  }
  

  accounts(date, end_date);
}



function sales_analytics(year){
  data = {'year': year};
  $.ajax({
      type : "POST",
      url: '/sales_analytics',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result){
        var year = document.getElementById('year');
        year.innerHTML = result.year;
        var total_sales = document.getElementById('total_sales');
        var num_of_sales = document.getElementById('num_of_sales');
        var select_year = document.getElementById('select_year');
        select_year.innerHTML = ""
        for(year in result.available_years){
           select_year.innerHTML += "<button class='btn btn-primary' onclick='sales_analytics("+ result.available_years[year] +")'>" + result.available_years[year] + "</button>"
        }
        total_sales.innerHTML = "$ " + result.total_sales + " CAD";
        num_of_sales.innerHTML = result.num_of_sales;
       
        monthly_number = []
        monthly_amount = []
        daily_number = []
        daily_amount = []
        for(val in result.sales_per_day){
          daily_number.push({label: result.sales_per_day[val][0], y:result.sales_per_day[val][1]})
          daily_amount.push({label: result.sales_per_day[val][0], y: result.sales_per_day[val][2]})
        }

        for(val in result.sales_per_month){
          monthly_number.push({label: result.sales_per_month[val][0], y: result.sales_per_month[val][1]})
          monthly_amount.push({label: result.sales_per_month[val][0], y: result.sales_per_month[val][2]})
        }

        var daily_sales = new CanvasJS.Chart("daily_sales", {
          animationEnabled: true,  
          theme: "light2", 
          title:{
            text: "Sales (Daily Based)",
            fontSize: 12
          },
          toolTip: {
            shared: true
          },
         
          data: [{
            type: "splineArea",
            name: 'Sales Total (cad-$)',
            color: "#708fff",            
            dataPoints: daily_amount
          },
          {
            type: "splineArea",
            name: "Number Of Orders",
            axisYType: "secondary",
            color: "#c991ff",
            dataPoints: daily_number
          }]

          });
         daily_sales.render();   
         
         var monthly_sales = new CanvasJS.Chart("monthly_sales", {
          animationEnabled: true,  
          theme: "light2", 
          title:{
            text: "Sales (Month Based)",
            fontSize: 12
          },
          toolTip: {
            shared: true
          },
         
          data: [{
            type: "column",
            name: 'Sales Total (cad-$)',
            color: "#708fff",            
            dataPoints: monthly_amount
          },
          {
            type: "column",
            name: "Number Of Orders",
            axisYType: "secondary",
            color: "#c991ff",
            dataPoints: monthly_number
          }]

          });
         monthly_sales.render(); 


     }

  });
}





function buyers(){
  $.ajax({
      type : "POST",
      url: '/buyers',
      contentType: 'application/json;charset=UTF-8',
      success: function(result){
          average_revenue = document.getElementById('average_revenue');
          average_revenue.innerHTML = "$ " + result.average_revenue + " CAD";
          

          number_of_sales = []
          amount_of_sales = []
          wait_time = []

           for(val in result.shipping_diff_country){
              shipping_diff_country.push({label: val , y: result.shipping_diff_country[val].difference}) 
              num_of_orders_country.push({label: val , y: result.shipping_diff_country[val].num_of_orders})                       
          }

          for(val in result.top_buyers){
              number_of_sales.push({label: result.top_buyers[val][1], y: result.top_buyers[val][2]})     
          }

          for(val in result.top_buyers_amount){ 
              amount_of_sales.push({label: result.top_buyers_amount[val][1], y: result.top_buyers_amount[val][2]})          
          }

          for(val in result.average_wait_time){
              wait_time.push({label: result.average_wait_time[val][1], y: result.average_wait_time[val][2]})              
          }




        var avg_wait_time= new CanvasJS.Chart("avg_wait_time", {
          animationEnabled: true,   
          title:{
            text: 'Avg. number of days b/w orders (Returning Users)',
            fontSize: 14
          },
          axisX:{
            labelFontSize: 9
          },         
          data: [{
            type: "column",
            color: "#3e95cd",
            markerSize: 1,
            
            dataPoints: wait_time
          }]

          });
         avg_wait_time.render();  

    

        var amount_of_sales_buyers = new CanvasJS.Chart("amount_of_sales_buyers", {
          animationEnabled: true,   
          title:{
            text: "Top Buyers (Amount Of Sales)",
            fontSize: 14
          },
          axisX:{
            labelFontSize: 9
          },         
          data: [{
            type: "column",
            color: "#3e95cd",
            markerSize: 1,
            
            dataPoints: amount_of_sales
          }]

          });
         amount_of_sales_buyers.render();  




        var num_of_sales_buyers = new CanvasJS.Chart("num_of_sales_buyers", {
          animationEnabled: true,   
          title:{
            text: "Top Buyers (Number Of Sales)",
            fontSize: 14
          },
          axisX:{
            labelFontSize: 9
          },         
          data: [{
            type: "column",
            color: "#3e95cd",
            markerSize: 1,
            
            dataPoints: number_of_sales
          }]

          });
         num_of_sales_buyers.render();  


        
      }

  });
}

function shipping(){
   $.ajax({
      type : "POST",
      url: '/shipping',
      contentType: 'application/json;charset=UTF-8',
      success: function(result){ 
         shipping_cost = document.getElementById('shipping_cost');
         shipping_charge = document.getElementById('shipping_charge');
         dynamic_charts = document.getElementById('dynamic_charts');
         shipping_charge.innerHTML = "$ " + result.total_charge + " CAD";
         shipping_cost.innerHTML = "$ " + result.total_cost + " CAD";       
         shipping_diff = []
         shipping_diff_country = []
         num_of_orders_country = []
         shipping_diff_province = []
         num_of_orders_province = []
         for(val in result.shipping_diff){
              shipping_diff.push({label: val , y: result.shipping_diff[val]}) 
                      
          }
         for(val in result.shipping_diff_country){
              shipping_diff_country.push({label: val , y: result.shipping_diff_country[val].difference}) 
              num_of_orders_country.push({label: val , y: result.shipping_diff_country[val].num_of_orders})                       
          }

          //////////////////////// Dynamic //////////////////////

          for(country in result.shipping_diff_province){
            new_list = []
            new_num_orders_list = []
            for(province in result.shipping_diff_province[country]){
              new_list.push({label: province , y: result.shipping_diff_province[country][province].difference})
              new_num_orders_list.push({label: province , y: result.shipping_diff_province[country][province].num_of_orders})
            }
            shipping_diff_province.push(new_list)
            num_of_orders_province.push(new_num_orders_list)
          }

          for(index in shipping_diff_province){
              dynamic_charts.innerHTML += "<div class='col-md-12'><div id='shipping_diff_province_"+index+"'style='height: 370px; width: 100%;'></div></div>"
          }

          for(index in shipping_diff_province){
            var chart_shipping_diff_province  = new CanvasJS.Chart("shipping_diff_province_" + index , {
            animationEnabled: true,
            toolTip: {
              shared: true
            },
            title:{
              text: "Shipping Difference based on Provinces",
              fontSize: 14
            },

            toolTip: {
              shared: true
            },

            axisX:{
              labelFontSize: 9
            },           
           
            data: [{
              type: "column",
              name: "Shipping Difference",
              color: "#c991ff",
              markerSize: 1,              
              dataPoints: shipping_diff_province[index]
            },
            {
              type: "column",
              name: "Number Of Orders",
              axisYType: "secondary",
              color: "grey",
              dataPoints: num_of_orders_province[index]
            }
            ]

            });
           chart_shipping_diff_province.render(); 

          }

          /////////////////////////////////////////////////////////////


          var chart_shipping_diff = new CanvasJS.Chart("shipping_diff", {
          animationEnabled: true,  
          title:{
            text: "Shipping Difference based on Orders",
            fontSize: 14
          },
         
          data: [{
            type: "splineArea",
            color: "#c991ff",
            markerSize: 1,
            
            dataPoints: shipping_diff
          }]

          });
         chart_shipping_diff.render();  

         
         var chart_shipping_diff_country = new CanvasJS.Chart("shipping_diff_country", {
          animationEnabled: true,  
          title:{
            text: "Shipping Difference based on Countries",
            fontSize: 14
          },
          toolTip: {
            shared: true
          },
         
          data: [{
            type: "column",
            name: 'Shipping Difference',
            color: "#c991ff",            
            dataPoints: shipping_diff_country
          },
          {
            type: "column",
            name: "Number Of Orders",
            axisYType: "secondary",
            color: "grey",
            dataPoints: num_of_orders_country
          }]

          });
         chart_shipping_diff_country.render();        
        
      }

  });
   
}






function best_selling_products(type){
  top_products = document.getElementById('top_products');
  top_products.innerHTML = '';
  data = {'type' : type};
  $.ajax({
      type : "POST",
      url: '/best_sellers',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result){
        var counter = 1;
        for(item in result['list_result']){
           top_products.innerHTML += "<div class='col-md-2'><div class='top_products'><div class='counter'>"+counter+"</div><img src='/static/img/"+result['list_result'][item][3]+"'><div class='content'><h6>"+result['list_result'][item][0]+"<hr/><b>Number Of Sales</b>: "+result['list_result'][item][1]+"<br/><b>Amount Of Sales</b>: "+result['list_result'][item][2]+" CAD-$ </h6></div></div></div>";
           counter = counter + 1;
        }

        
      }

  });
}

function best_selling_brands(type){
  data = {'type' : type};
  $.ajax({
      type : "POST",
      url: '/best_selling_brands',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(result){
        number_of_sales = []
        amount_of_sales = []
        for(item in result['list_result']){
           number_of_sales.push({label:result['list_result'][item][0], y:result['list_result'][item][1]});
           amount_of_sales.push({label:result['list_result'][item][0], y:result['list_result'][item][2]});
        }

        var num_of_sales = new CanvasJS.Chart("num_of_sales", {
          animationEnabled: true,
          title: {
            text: "Number of sales for each Brand",
            fontSize:14
          },
          data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "{label}: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 12,
            indexLabel: "{label} - {y}",
            dataPoints:number_of_sales
          }]
        });
        num_of_sales.render();

        var amt_of_sales = new CanvasJS.Chart("amount_of_sales", {
          animationEnabled: true,
          title: {
            text: "Amount of Sales for each Brand",
            fontSize:14
          },
          data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "{label}: {y} cad-$",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 12,
            indexLabel: "{label} - {y} cad-$",
            dataPoints:amount_of_sales
          }]
        });
        amt_of_sales.render();

      

        
      }

  });
}








window.onload = function() {  

   if (document.getElementById("accounts") !== null){
     change_accounts_date('', '');  
   }

   if (document.getElementById("sales") !== null){
       sales_analytics('');
   }  

   if (document.getElementById("dashboard") !== null){
      buyers();
      best_selling_brands('num_of_sales');
      shipping();
      
   }

};

   

   