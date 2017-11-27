var connection =  new require('./kafka/connection');
var auth = require('./services/auth');
var hotel = require('./services/hotel');
var flight = require('./services/flight');
var car = require('./services/car');
var booking = require('./services/booking');
var customer = require('./services/customer');
var profile = require('./services/profile');
var analytics = require('./services/analytics');
var mongo = require('./services/mongo');
var cron = require('./services/cron');
var redis = require('./services/redis');


mongo.createConnectionPool();

// var mongoWithDbPool = require('./services/mongoWithDbPool');
// mongoWithDbPool.connect();
var mysql = require('./services/mysql');
mysql.createConnectionPool(150);

var config = require('config');
var topic_name = config.kafkaTopic;
console.log('server is running');

var producer = connection.getProducer();
var consumer = connection.getConsumer(topic_name);

consumer.on('message', function (message) {
  var data = JSON.parse(message.value)
  switch (data.km.value) {
    //auth
    case 'signin':
    auth.signin(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'signup':
    auth.signup(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    //admin
    case 'getCustomers':
    customer.getCustomers(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCustomerById':
    customer.getCustomerById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'updateCustomerById':
    customer.updateCustomerById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'deleteCustomersById':
    customer.deleteCustomerById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'addHotel':
    hotel.addHotel(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getHotels':
    hotel.getHotels(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getHotelById':
    hotel.getHotelById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'updateHotelById':
    hotel.updateHotelById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'deleteHotelById':
    hotel.deleteHotelById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'addFlight':
    flight.addFlight(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getFlights':
    flight.getFlights(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getFlightById':
    flight.getFlightById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'updateFlightById':
    flight.updateFlightById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'deleteFlightById':
    flight.deleteFlightById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'addCar':
    car.addCar(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCars':
    car.getCars(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCarById':
    car.getCarById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'updateCarById':
    car.updateCarById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'deleteCarById':
    car.deleteCarById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getBills':
    booking.getBills(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getBillById':
    booking.getBillById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    //user
    case 'getProfile':
    profile.getProfile(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'updateProfile':
    profile.updateProfile(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'addCreditCard':
    profile.addCreditCard(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCreditCards':
    profile.getCreditCards(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'deleteCreditCardById':
    profile.deleteCreditCardById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getHotelsForCustomer':
    hotel.getHotelsForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getFlightsForCustomer':
    flight.getFlightsForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCarsForCustomer':
    car.getCarsForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getHotelByIdForCustomer':
    hotel.getHotelByIdForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getFlightByIdForCustomer':
    flight.getFlightByIdForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getCarByIdForCustomer':
    car.getCarByIdForCustomer(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'makeBooking':
    booking.makeBooking(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getBookings':
    booking.getBookings(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getBookingById':
    booking.getBookingById(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'trackClick':
    analytics.trackClick(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'trackTotalDurationSpent':
    analytics.trackTotalDurationSpent(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getRevenueByType':
    analytics.getRevenueByType(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getRevenueByCity':
    analytics.getRevenueByCity(data.data, function(err,res){
      var payloads = [
        {
          topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : res
          }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        //console.log(data);
      });
      return;
    });
    break;
    case 'getRevenueByTopCmpny':
	    analytics.getRevenueByTopCmpny(data.data, function(err,res){
	      var payloads = [
	        {
	          topic: data.replyTo,
	          messages:JSON.stringify({
	            correlationId:data.correlationId,
	            data : res
	          }),
	          partition : 0
	        }
	      ];
	      producer.send(payloads, function(err, data){
	        //console.log(data);
	      });
	      return;
	    });
	    break;
    case 'getUserAnalytics':
	    analytics.getUserAnalytics(data.data, function(err,res){
	      var payloads = [
	        {
	          topic: data.replyTo,
	          messages:JSON.stringify({
	            correlationId:data.correlationId,
	            data : res
	          }),
	          partition : 0
	        }
	      ];
	      producer.send(payloads, function(err, data){
	        //console.log(data);
	      });
	      return;
	    });
	    break;
    default:
    return;
  }
})
