var tronWeb;
var waiting = 0;
var currentAddr;
var time = 0;
var pottime = 0;
var bondNum = 0;


var a_godTimer = "";
var godtimer_in_seconds = 0;
var god_numhours = 0;
var god_numminutes = 0;
var god_numseconds = 0;

var god_roundover = false;
var godtimer_lastminute = 300;
var i_godTimer = true;
var appended = false;
var loadedCode = false;



async function main() {

    if (typeof(window.tronWeb) === 'undefined') {
        console.log('Waiting for tronWeb...');
        waiting += 1;
        if (waiting == 5) {
            alert('please ensure tronlink is installed and connected ');
        }
        setTimeout(main, 1000);
    } else {
        tronWeb = window.tronWeb;
        Decker = await tronWeb.contract().at("TC5CguKYfnzJVyBwziJWJjBhanihahYv9P");

        BigNumber = tronWeb.BigNumber;
        currentAddr = tronWeb.defaultAddress['base58'];
        setTimeout(function() {
            $('#check').hide();
            // appenddiv();
        }, 2000);
        setInterval(function() {
            mainloop();
           
        }, 2000);
    }
}

function nFormatter(num) {
    isNegative = false
    if (num < 0) {
        isNegative = true
    }
    num = Math.abs(num)
    if (num >= 1000000000) {
        formattedNumber = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    } else if (num >= 1000000) {
        formattedNumber = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        formattedNumber = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        formattedNumber = num;
    }
    if (isNegative) {
        formattedNumber = '-' + formattedNumber
    }
    return formattedNumber;
}
 

function fastupdateGodTimer(data) {
    if (i_godTimer == true) {
        var _blocktime = (new Date()).getTime(); //current "blocktime" in milliseconds
        var bck = _blocktime / 1000;
        if(bck >= data){
            $('#opcbtn').css("opacity", "1");
           $('#opcbtn2').css("opacity", "1");
            $("#opcbtn").css("cursor: pointer");
            $("#opcbtn2").css("cursor: pointer");
           }
        else{
            $('#opcbtn').css("opacity", ".5");
            $('#opcbtn2').css("opacity", ".5");
             $("#opcbtn").css("cursor" , "not-allowed");
            $("#opcbtn2").css("cursor", "not-allowed");
        }
        var _timer = data - bck;

        if (_timer > 0) {
        godtimer_lastminute = 0;
        var _hours = Math.floor(_timer / 3600);
        if (_hours < 10) {
            _hours = "0" + _hours
        }
        var _minutes = Math.floor((_timer % 3600) / 60);
        if (_minutes < 10) {
            _minutes = "0" + _minutes
        }
        var _seconds = parseFloat((_timer % 3600) % 60).toFixed(0);
        if (_seconds < 10) {
            _seconds = "0" + _seconds
        }


        document.getElementById('Time').innerHTML = _hours + "h : " + _minutes + "m : " + _seconds + 's ';
        
        god_roundover = false;
       
     } else {
           document.getElementById('Time').innerHTML =  0  + "h : " + 0 + "m : " + 0 + 's ';
 
    }
    }
}
 

function mainloop() {
    if (tronWeb.defaultAddress['base58'] !== currentAddr) {
        location.reload();
    }
   
  
     Decker.isPlayer(currentAddr).call().then(result => {
        var check = ((result.toString()));
         if(check == 'false'){
             $('#faq').show();
               if(loadedCode == false){
                var query = window.location.search.split("=")[1];
                 document.getElementById("specialId").value = query;
                 console.log(query)
                   loadedCode = true;
                }
           }
         else{
             $('#faq').hide()
         }

    });
    
      Decker._profits(currentAddr).call().then(result => {
         
         document.getElementById("_earned").textContent = (result.toNumber())/1e6;
    });
    

    
   var checking = document.getElementById("specialId").value;
     Decker.isCode(checking).call().then(result => {
          var check = ((result.toString()));
         console.log('check',check);
         if(check == 'false'){
            // btnjoin
              //$("#btnjoin").attr("disabled",true);
              $("#btnjoin").hide();
           //   $("#btnjoin").prop("disabled",true);
         }
         else{
               $("#btnjoin").show();
             // $("#btnjoin").attr("disabled",true);
         }
    });

    
     Decker.startTime().call().then(result => {
            var _time = ((result.toNumber()));
           fastupdateGodTimer(_time)
    });
    
    
    
 
    
    
    /*
      uint Id;
      address Sponsor;
      uint Invested;
      uint Withdrawn;
      uint CashBack;
      uint reffered;
      
      totalFund
      players
      
      */
    
     Decker.totalFund().call().then(result => { 
          var _amt = (result.toNumber());
           document.getElementById("_amt").textContent = _amt/1e6;
         });
     Decker.rewards().call().then(result => { 
          var rewards = (result.toNumber());
           document.getElementById("rewards").textContent = rewards/1e6;
         });
    
     Decker.totalRefBonus(currentAddr).call().then(result => { 
          var totalRefBonus = (result.toNumber());
           document.getElementById("totalRefBonus").textContent = totalRefBonus/1e6;
         });
      
  
    
    
     Decker.players().call().then(result => { 
           var _pl = (result.toNumber());
           document.getElementById("_pl").textContent = _pl;
         });
    Decker.Player(currentAddr).call().then(result => {
        var _id = (result.Id.toNumber());
        var _Invested = (result.Invested.toNumber());
         var _Withdrawn = (result.Withdrawn.toNumber());
         var _CashBack = (result.CashBack.toNumber());
         console.log(tronWeb.address.fromHex(result.Sponsor.toString()));
        var dataRef = window.location.origin + "?ref=" + _id;
        document.getElementById("_ref").value = dataRef;
        
         document.getElementById("_Invested").textContent = _Invested/1e6;
         document.getElementById("_Invested1").textContent = _Invested/1e6;
          document.getElementById("_Withdrawn").textContent = _Withdrawn/1e6;
         document.getElementById("CashBack").textContent = _CashBack/1e6;

    });
  


}



$('#getid').click(function() {
    var data ;
    var sponsor;
     document.getElementById("_bool").value = 1;
    
     Decker.lastGivenSponsor().call().then(result => {
         data = result.toNumber();
         
         
        Decker._freeReferalLineUp(data).call().then(result => {
           var _add = result.toString();
         
          Decker.Player(_add).call().then(result => {
           var _id = (result.Id.toNumber());
           document.getElementById("specialId").value = _id;

         });
     });    
         
  });   
    
});
 


function buy() {

    var value = document.getElementById("buy").value;
    
    Decker.investNow().send({
        callValue: value * 1e6

    }).then(result => {


        callback();
    }).catch((err) => {
        console.log(err)
    });

}


function joinow(){
    var value = document.getElementById("specialId").value;
    var check =  document.getElementById("_bool").value;
    Decker.JoinGame(value,check).send({
        
    }).then(result => {


        callback();
    }).catch((err) => {
        console.log(err)
    });

}


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       
}

function copyRef() {
  var copyText = document.getElementById("_ref");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function withdraw(){
    
    Decker.withdraw().send({
        
    }).then(result => {


        callback();
    }).catch((err) => {
        console.log(err)
    });

}




main();