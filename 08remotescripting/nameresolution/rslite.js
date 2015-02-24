/*

RSLite 1.0 - by Brent Ashley
Simple non-concurrent remote scripting calls.
send one string, receive one string

1) use this include
2) in body_onload(), set the RSLite var:
   // make sure not to scope it locally, since it's a global variable
   RSLite = new RSLiteObject();
3) before using, set callback and failure functions if you want more than an alert
4) set interval and attempts for retries if defaults not suitable
5) call it, passing single parm:
   RSLite.call( rsPage, parm )
6) your callback receives string, or failure function called.

rsPage simply takes input parm "p" and sets session-expiry cookie called "RSLite".
it's a good idea to also immediately print out the value you send so you can 
debug by going to that page with the browser


*/

function RSLiteObject(){
  this.interval = 500;
  this.attempts = 3;
  this.i = new Image();
  this.call = function ( page, parm ){
    parm = (parm != null)? parm : '';
    var d = new Date();
    document.cookie = 'RSLite=x; expires=Fri, 31 Dec 1999 23:59:59 GMT;';
    this.i.src = page + '?u=' + d.getTime() + '&p=' + parm;
    setTimeout( "RSLite.receive(1);", this.interval );
  }  
  this.receive = function ( attempt ){  
                   var response = null;
                   var aCookie = document.cookie.split("; ");
                   for (var i=0; i < aCookie.length; i++){
                     var aCrumb = aCookie[i].split("=");
                     if (aCrumb[0] == 'RSLite') response = aCrumb[1];
                   }
                   if ( response != null ){
                     this.callback( unescape(response.replace(/\+/g,' ')) );
                   } else {
                     if (attempt < this.attempts){
                       setTimeout( "RSLite.receive( " + (attempt+1) +" );",this.interval);
                     } else {
                       this.failure();
                     }
                   }    
                 }
  this.callback = function( response ){ 
                    alert(response); 
                  }
  this.failure = function(){ 
                   alert( "RSLite timed out"); 
                 }
}
var RSLite;
