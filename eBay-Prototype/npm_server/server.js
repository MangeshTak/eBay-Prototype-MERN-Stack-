var express = require('express');
var {user} = require('./Database/user');
var {Cart} = require('./Database/cart');
var {productinfo} = require('./Database/productinfo');
var {authenticate} = require('./middleware/authenticate');
var bodyParser = require('body-parser')
var app = express();
var bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.get('/' , (req,res) => {
	console.log('Hello');
	res.send('hello world');
});

app.post('/signup' , (req,res) => {
	
	bcrypt.genSalt(saltRounds, function(err, salt) {

    bcrypt.hash(req.body.password, salt, function(err, hash) {

        var UserNew = new user({
		firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        phonenumber: req.body.phonenumber
	});

	UserNew.save().then((doc) => {
		return UserNew.generateAuthToken();
		//res.send(doc);
	}).then((token) => {
		res.header('x-auth',token).send(UserNew);
	});

    });
});

});

app.get('/users/me', authenticate, (req,res) => {
	res.send(req.user);
	console.log(req.user);
});

app.post('/logout', (req,res) => {
	console.log(req.body);

	user.findByToken(req.body.token).then((ret_user) => {
		if(!ret_user) {
			return Promise.reject();
		}

		ret_user.removeToken(req.body.token).then((token) => {
			console.log('a');
			res.status(200).send();		
		}, () =>{
			console.log('b');
			res.status(400).send();
		});		
		
	}).catch((e) => {
		res.status(401).send();
	});

});

app.post('/login' , (req,res) => {

	user.findOne({ email: req.body.email }, function (err, person) {

  		if (err) {
  			res.send(err);
  		}else {
  			bcrypt.compare(req.body.password, person.password, function(err, result) {
  				
    			if(result === true ){
    				return person.generateAuthToken().then((token) => {
    					res.header('x-auth',token).send(person);
    				});
    				
    			}else{
    				res.send(err);
    			}
			});	
  		}
 		});
	});

app.post('/postAd' , (req,res) => {

        var ProductNew = new productinfo({
		Name: req.body.Name,
        Description: req.body.Description,
        Price: req.body.Price,
        NumberOfItems: req.body.NumberOfItems
	});

	ProductNew.save(function (err) {
  		if (err){
  			res.send(err);	
  		} else {
  			res.send(ProductNew);
  		}
	});
    });

app.get('/getAd', function(req, res) {
  productinfo.find({}, function(err, users) {
    res.send(users);  
  });
});


app.post('/addCart', function(req,res) {

	Cart.findOne({user_id: req.body.user_id, ProductName: req.body.ProductName}, function (err, doc){
		
		if(err){
			res.send(err);
		}
		else if(doc){

			doc.TotalPrice = doc.TotalPrice+req.body.BasePrice;
	  		doc.NumberOfItems = doc.NumberOfItems+1;
	  		doc.save(function (err) {
	  		if (err){
	  			res.send(err);	
	  		} else {
	  			res.send(doc);
	  		}
			});	

		}else if(!doc){

			var cartNew = new Cart({
			ProductName: req.body.ProductName,
	        BasePrice: req.body.BasePrice,
	        NumberOfItems: 1,
	        TotalPrice: req.body.BasePrice,
	        user_id: req.body.user_id
			});

			cartNew.save(function (err) {
	  		if (err){
	  			res.send(err);	
	  		} else {
	  			res.send(cartNew);
	  		}
			});

		}
	  
	});

});

app.post('/getCart', function(req,res) {

	Cart.find({user_id: req.body.user_id}, function (err, doc){
		
		if(err){
			res.send(err);
		}
	  	
	  	res.send(doc);	
	  
	});

});

app.post('/checkout', function(req,res) {

	Cart.remove({user_id: req.body.user_id}, function (err, doc){
		
		if(err){
			res.send(err);
		}
	  	
	  	res.send(doc);	
	  
	});

app.post('/removeItem', function(req,res) {
	Cart.findOne({user_id: req.body.user_id, ProductName: req.body.ProductName}, function (err, doc){
		
		if(err){
			res.send(err);
		}else if(doc.NumberOfItems>1){
			doc.NumberOfItems = doc.NumberOfItems - 1;

			doc.save(function (err) {
	  		if (err){
	  			res.send(err);	
	  		} else {
	  			res.send(doc);
	  		}
			});

		}else{

			doc.remove();
			doc.save(function (err) {
	  		if (err){
	  			res.send(err);	
	  		} else {
	  			res.send(doc);
	  		}
			});	
		}
	  
	});
});

});


app.listen(4000, () => {
	console.log('Started on port 4000');
});
