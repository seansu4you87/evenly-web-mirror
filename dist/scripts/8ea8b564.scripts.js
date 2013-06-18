"use strict";var Evenly=angular.module("evenlyApp",["restangular","ngCookies","ui.bootstrap","ui.validate","Payment"]);Evenly.config(["$routeProvider",function(a){a.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/splash",{templateUrl:"views/splash.html",controller:"SplashCtrl"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/wallet",{templateUrl:"views/wallet.html",controller:"WalletCtrl"}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).otherwise({redirectTo:"/home"})}]),Evenly.config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["X-Requested-With"]}]),Evenly.config(["RestangularProvider",function(a){a.setBaseUrl("http://localhost\\:5000/api/v1")}]),window.Evenly=Evenly,angular.module("evenlyApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma","Sean Yu"]}]),angular.module("evenlyApp").controller("SplashCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("evenlyApp").controller("HomeCtrl",["$scope","Me",function(a,b){b.newsfeed().then(function(b){a.newsfeed=b})}]),angular.module("evenlyApp").controller("LoginCtrl",["$scope","$location","Session",function(a,b,c){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.email="sean@paywithivy.com",a.password="haisean",a.login=function(a,d){c.create(a,d).then(function(a){console.log(a),b.path("/home")})}}]),angular.module("evenlyApp").controller("WalletCtrl",["$scope",function(a){a.showAddCardModal=function(){a.addCardShouldBeOpen=!0},a.hideAddCardModal=function(){a.addCardShouldBeOpen=!1},a.showAddBankAccountModal=function(){a.addBankAccountShouldBeOpen=!0},a.hideAddBankAccountModal=function(){a.addBankAccountShouldBeOpen=!1},a.showDepositModal=function(){a.depositShouldBeOpen=!0},a.hideDepositModal=function(){a.depositShouldBeOpen=!1},a.opts={backdropFade:!0,dialogFade:!0,dialogClass:"modal cc-modal"},a.selectHistory=function(){console.log("show history"),a.showHistory=!0,a.showCards=!1,a.showBankAccounts=!1},a.selectCards=function(){console.log("show cards"),a.showHistory=!1,a.showCards=!0,a.showBankAccounts=!1},a.selectBankAccounts=function(){console.log("show bank accounts"),a.showHistory=!1,a.showCards=!1,a.showBankAccounts=!0},a.showBankAccounts=!0}]),angular.module("evenlyApp").controller("ProfileCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("evenlyApp").controller("NavCtrl",["$scope","$location",function(a,b){a.name="Jabroni",a.stateForItem=function(a){var c=b.path().substring(1);return a===c?"active":""}}]),angular.module("evenlyApp").controller("ActionBarCtrl",["$scope",function(a){a.showPaymentModal=function(){a.paymentShouldBeOpen=!0},a.hidePaymentModal=function(){a.paymentShouldBeOpen=!1},a.showRequestModal=function(){a.requestShouldBeOpen=!0},a.hideRequestModal=function(){a.requestShouldBeOpen=!1},a.opts={backdropFade:!0,dialogFade:!0}}]),angular.module("evenlyApp").controller("PaymentCtrl",["$scope","Payment",function(a,b){a.makePayment=function(){console.log("You owe "+a.recipient+" $"+a.amount+" for "+a.description),b.create({amount:a.amount,description:a.description,to:{email:a.recipient}}).then(function(){a.hidePaymentModal(),toastr.success("$"+a.amount+" sent to "+a.recipient+" for "+a.description),a.reset()},function(b){a.serverError=b.data,a.submitting=!1,a.showPaymentModal()})}}]),angular.module("evenlyApp").controller("RequestCtrl",["$scope","Request",function(a,b){a.makeRequest=function(){console.log(a.recipient+" owes you $"+a.amount+" for "+a.description),b.create({amount:a.amount,description:a.description,to:{email:a.recipient}}).then(function(){a.hideRequestModal(),toastr.success("$"+a.amount+" requested from "+a.recipient+" for "+a.description),a.reset()},function(b){a.serverError=b.data,a.submitting=!1,a.showRequestModal()})}}]),angular.module("evenlyApp").controller("AddCardCtrl",["$scope","CreditCard","balanced",function(a,b,c){a.addCard=function(){a.validForm()?(console.log("adding card"),c.tokenizeCard(a.card,function(a){201===a.status&&b.create({uri:a.data.uri}).then(function(a){console.log("Added credit card!"),console.log(a)},function(a){console.log("Failed to add credit card to Vine"),console.log(a)})})):a.showErrors=!0},a.cardType=function(a){return $.payment.cardType(a)},a.validForm=function(){return void 0===a.form.number||void 0===a.form.cvc||void 0===a.form.expiry?!1:!(a.form.number.$error.cardNumber||a.form.number.$error.required||a.form.cvc.$error.cardCVC||a.form.cvc.$error.required||a.form.expiry.$error.cardExpiry||a.form.expiry.$error.required)},a.classForButton=function(){return a.validForm()?"btn btn-primary":"btn btn-primary disabled"}}]),angular.module("evenlyApp").controller("AddBankAccountCtrl",["$scope","BankAccount","balanced",function(a,b,c){a.addBankAccount=function(){a.validForm()?(console.log("adding bank account"),c.tokenizeBankAccount(a.bankAccount,function(a){201===a.status&&b.create({uri:a.data.uri}).then(function(a){console.log("Added bank account!"),console.log(a)},function(a){console.log("Failed to add bank account to Vine"),console.log(a)})})):a.showErrors=!0},a.validForm=function(){return void 0===a.form.name||void 0===a.form.routingNumber||void 0===a.form.accountNumber?!1:!a.form.name.$error.required&&!a.form.routingNumber.$error.required&&!a.form.accountNumber.$error.required},a.classForButton=function(){return a.validForm()?"btn btn-primary":"btn btn-primary disabled"}}]),Evenly.factory("Session",["Restangular","$rootScope","$cookieStore",function(a,b,c){return{create:function(d,e){return a.all("sessions").post({email:d,password:e}).then(function(a){return console.debug("Session retrieved: "+a.authentication_token),c.put("vine_token",a.authentication_token),b.authenticationToken=a.authentication_token,a})},destroy:function(){return a.one("sessions","").remove()}}}]),Evenly.factory("User",["Restangular",function(a){return{create:function(b){return a.all("users").post(b)},all:function(b){return a.all("users").getList({query:b})},me:function(){return a.one("me","").get()}}}]),Evenly.factory("Me",["Restangular","$rootScope","$http","$cookieStore",function(a,b,c,d){var e=a.one("me",""),f=null;return f=null!==d.get("vine_token")?d.get("vine_token"):b.authenticationToken,c.defaults.headers.common.Authorization=f,{timeline:function(){return e.getList("timeline")},newsfeed:function(){return e.getList("newsfeed")},history:function(){return e.getList("history")}}}]),Evenly.factory("Payment",["Restangular",function(a){return{create:function(b){return a.all("payments").post(b)}}}]),Evenly.factory("Request",["Restangular",function(a){return{create:function(b){return a.all("charges").post(b)}}}]),Evenly.factory("Deposit",["Restangular",function(a){return{create:function(b){return a.all("withdrawals").post(b)}}}]),Evenly.factory("CreditCard",["Restangular",function(a){return{all:function(){return a.all("creditcards").getList()},create:function(b){return a.all("creditcards").post(b)},destroy:function(b){return a.one("creditcards",b).remove()},activate:function(b){return a.one("creditcards",b).customPUT("activate")}}}]),Evenly.factory("BankAccount",["Restangular",function(a){return{all:function(){return a.all("bankaccounts").getList()},create:function(b){return a.all("bankaccounts").post(b)},destroy:function(b){return a.one("bankaccounts",b).remove()},activate:function(b){return a.one("bankaccounts",b).customPUT("activate")}}}]),angular.module("evenlyApp").directive("eveRecipient",["User",function(a){return{templateUrl:"views/recipient.html",restrict:"E",replace:!0,link:function(b){b.getUsers=function(b){return console.debug("querying "+b),a.all(b).then(function(a){return _.map(a,function(a){return{name:a.name,email:a.email}})})},b.onSelect=function(a,b,c){console.log(a),console.log(b),console.log(c)}}}}]),angular.module("evenlyApp").directive("eveAmount",function(){return{templateUrl:"views/amount.html",restrict:"E",replace:!0,link:function(a){a.isCurrency=function(a){return console.log("validating currency"),/^\$?[0-9][0-9\,]*(\.\d{1,2})?$|^\$?[\.]([\d][\d]?)$/.test(a)},a.isGte=function(a,b){return console.log("validating gte"),b=b||.5,void 0===a?!1:a.replace(/[^0-9\.]/g,"")>=b}}}}),angular.module("evenlyApp").directive("eveExchangeForm",function(){return{templateUrl:"views/exchange-form.html",restrict:"E",replace:!0,link:function(a){a.invalidRecipient=function(){return void 0!==a.form.recipient?!!a.form.recipient.$error.required:void 0},a.invalidAmount=function(){if(void 0!==a.form.amount){var b=!!a.form.amount.$error.gte,c=!!a.form.amount.$error.currency;return b||c}},a.invalidDescription=function(){return void 0!==a.form.description?!!a.form.description.$error.required:void 0},a.invalidForm=function(){var b=a.invalidAmount(),c=a.invalidDescription();return b||c},a.showAmountCurrencyError=function(){return void 0!==a.form.amount?!!a.form.amount.$error.currency&&a.submitAttempted:void 0},a.showAmountGteError=function(){return void 0!==a.form.amount?!!a.form.amount.$error.gte&&a.submitAttempted:void 0},a.showDescriptionRequiredError=function(){return void 0!==a.form.description?!!a.form.description.$error.required&&a.submitAttempted:void 0},a.showErrors=function(){var b=a.showAmountCurrencyError()||a.showAmountGteError()||a.showDescriptionRequiredError()||a.serverError;return a.submitAttempted&&b},a.classForRecipient=function(){return void 0!==a.form.recipient&&void 0!==a.form.recipient.$viewValue?a.invalidRecipient()?"error":"success":void 0},a.classForAmount=function(){return void 0!==a.form.amount&&void 0!==a.form.amount.$viewValue?a.invalidAmount()?"error":"success":void 0},a.classForDescription=function(){return void 0!==a.form.description&&void 0!==a.form.description.$viewValue?a.invalidDescription()?"error":"success":void 0},a.classForButton=function(){return a.submitting?"btn-primary disabled":a.invalidForm()?"btn-primary disabled":"btn-primary"}}}}),angular.module("evenlyApp").directive("eveExchangeModal",function(){return{templateUrl:"views/exchange-modal.html",restrict:"E",link:function(a,b,c){a.type=c.type,a.hide=function(){a.$eval(c.hide)},a.submit=function(){return a.submitAttempted=!0,a.invalidForm()?(console.log("form is invalid!"),void 0):(a.submitting=!0,a.$eval(c.submit),void 0)},a.reset=function(){a.submitAttempted=!1,a.submitting=!1,a.serverError=void 0,a.amount=null,a.recipient=null,a.description=null},a.$watch("submitting",function(){a.submitting?(a.oldSubmitMessage=a.submitMessage,a.submitMessage="Sending "+a.type+"..."):void 0!==a.oldSubmitMessage&&(a.submitMessage=a.oldSubmitMessage)}),"request"===a.type?(a.title="Request",a.submitMessage="Complete Request",a.help1="",a.help2="owes me"):"payment"===a.type&&(a.title="New Payment",a.submitMessage="Complete Payment",a.help1="Pay",a.help2=""),a.help3="for"}}}),angular.module("evenlyApp").directive("eveExchangeButtons",function(){return{templateUrl:"views/exchange-buttons.html",restrict:"E",link:function(a,b,c){console.log("linking eveExchangeButtons "+a+" "+b+" "+c)}}});var defaultCallback=function(a){switch(a.status){case 201:console.log("got em!");break;case 400:console.error("missing fields");break;case 402:console.error("couldn't authorize the buyer's credit card");break;case 404:console.error("incorrect marketplace URI");break;case 500:console.error("retry")}};angular.module("evenlyApp").factory("balanced",[function(){var a="/v1/marketplaces/TEST-MP6oLyrmIAAsRrnzFWmWAQxo";return balanced.init(a),{tokenizeCard:function(a,b){var c={card_number:a.number,expiration_month:a.expiry.split("/")[0],expiration_year:"20"+a.expiry.split("/")[1].trim(),security_code:a.cvc};balanced.card.create(c,function(a){defaultCallback(a),b&&b(a)})},tokenizeBankAccount:function(a,b){var c={name:a.name,account_number:a.accountNumber,routing_number:a.routingNumber};balanced.bankAccount.create(c,function(a){defaultCallback(a),b&&b(a)})}}}]),angular.module("evenlyApp").controller("HistoryCtrl",["$scope","Me",function(a,b){b.history().then(function(b){a.history=_.map(b,function(a){"Withdrawal"===a.class?(a.verb="deposited into",a.subject="You",a.object=a.bank_name,a.topic="Deposit into "+a.bank_name):(a.verb="paid",a.subject="me"!==a.from?a.from.name:"You",a.object="me"!==a.to?a.to.name:"You",a.topic=("me"===a.from?a.to.name:a.from.name)+" · "+a.description),a.formattedDate=Date.parse(a.created_at),a.amountClass="You"===a.subject?"history-item-amount-sent":"history-item-amount-received";var b="You"===a.subject?"+$":"-$";return a.amountString=b+a.amount,a})})}]),angular.module("evenlyApp").controller("CardsCtrl",["$scope","CreditCard",function(a,b){a.loadCards=function(){b.all().then(function(b){_.each(b,function(a){console.log(a)}),a.cards=b},function(a){console.error(a)})},a.deleteCard=function(a){b.destroy(a).then(function(a){console.log("destroyed!"),console.log(a)},function(a){console.log("fucked up"),console.log(a)})},a.activateCard=function(c){b.activate(c).then(function(b){console.log("activated!"),console.log(b),a.loadCards()},function(a){console.log("fucked up"),console.log(a)})},a.loadCards()}]),angular.module("evenlyApp").controller("BankAccountsCtrl",["$scope","BankAccount",function(a,b){a.loadBankAccounts=function(){b.all().then(function(b){_.each(b,function(a){console.log(a)}),a.bankAccounts=b},function(a){console.error(a)})},a.deleteBankAccount=function(a){b.destroy(a).then(function(a){console.log("destroyed!"),console.log(a)},function(a){console.log("fucked up"),console.log(a)})},a.activateBankAccount=function(c){b.activate(c).then(function(b){console.log("activated!"),console.log(b),a.loadBankAccounts()},function(a){console.log("fucked up"),console.log(a)})},a.loadBankAccounts()}]),angular.module("evenlyApp").controller("DepositCtrl",["$scope","Deposit",function(a,b){a.makeDeposit=function(){b.create({amount:a.amount}).then(function(a){console.log("Deposit succeeded!"),console.log(a)},function(a){console.error("failure"),console.error(a)})}}]);