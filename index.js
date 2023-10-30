var packet;
let lst=[];
let packet_list = [];
var max_voltage = 0;
var min_voltage = 600;
var avg_packet;
var voltage;
var val = 0;
var i;
var sum = 0;
var len;
var serviceID = "service_sn7ro48";
var templateID2 = "template_jgodj5t";
var templateID1 ="";

// To get the port from adreno.
async function startSerial() {
  if ("serial" in navigator) {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({
        baudRate: 9600, // Set the baud rate to 9600
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      });

      var popup = document.getElementById("popup");
      popup.style.display = "block";
      
      console.log("Serial Port Opened");

      const reader = port.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("Reader has been canceled");
          break;
        }

        //to change color of the button
        var but = document.getElementById("but");
        but.style.background = "green";
        but.innerHTML="Running";


        // To display the voltage at the HTML page.
        packet = new TextDecoder().decode(value).trim();
        voltage = parseInt(packet);
        if(voltage!=0){
          voltage-=20;
        }
        if(voltage<100){
          voltage=0;
        }
        

        if (!isNaN(voltage)) {
          lst.push(voltage);
          document.getElementById("pac").innerHTML = voltage;
        }

        if (!isNaN(voltage) &&(voltage>200)) {
          packet_list.push(voltage);
        }
        

        if ((lst.length >= 7) && (voltage>=0)) {

          popup.style.display = "none";
          //max-voltage
          if (voltage > max_voltage && voltage < 450) {
            max_voltage = voltage;
          }
          // Min-voltage.
          if ( (voltage < min_voltage && voltage > 200)) {
            min_voltage = voltage;
            document.getElementById("min").innerHTML = min_voltage;
          }
          else if((voltage==0)&&(min_voltage<200)){
            document.getElementById("min").innerHTML = 0;
          }
          avg_packet =0;
          len = packet_list.length;
          sum = 0; // Initialize the sum variable
        
            for (i = 7; i < len; i++) {
              sum += packet_list[i]; // Accumulate the sum of elements
            }
            avg_packet = sum / (len-7); // Calculate the average
          

          document.getElementById("avg").innerHTML = avg_packet.toFixed(1);
          document.getElementById("max").innerHTML = max_voltage;


         var alert= document.getElementById("alert");
          //voltmter is not connectd
          if((voltage<100)&&(val==0) ){
            try{
              
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! Adreno not connected to supply!",
                sub:"Power failure"
              };
              
              const templateID = "template_tojjrhg";
              console.log("alert-mailsent-power failure");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
              
              alert.style.display="block";
          
                  setInterval(function(){
                    alert.style.border="none";
                  },500)
                
            }
            catch{
              console.log("err");
            }
          }
  
          //send mail if voltage is low.The voltmeter is connected.
          else if(((voltage<200) && (voltage>100))&&(val==0)){
            try{
              
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! voltage reached lower the limit",
                sub:"Under voltage"
              };
              
              const templateID = "template_tojjrhg";
              console.log("alert-mailsent-lower voltage");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
            }
            catch{
              console.log("err");
            }
          }
  
          //send mail if voltage if high.
          else if((voltage>290)&&(val==0)){
            try{
              
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! voltage reached higher the limit",
                sub:"Over voltage!"
              };
              
              const templateID = "template_tojjrhg";
              console.log("alert-mailsent-high");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
            }
            catch{
              console.log("err");
            }
          }
          else if((voltage>200)&&(voltage<290)){
            val=0;
            alert.style.display="none";
          }

        }
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Web serial not supported");
  }
}


//to send mail manually.
function send_mail(){
  console.log("mail sent manually");

  var params = {
    current_voltage: voltage,
    avg_voltage: avg_packet.toFixed(2),
    max_voltage: max_voltage,
    min_voltage:min_voltage,
  };
  emailjs.send(serviceID, templateID2, params)
  alert("Your message sent successfully!!")
}

//To send mail automatically for every time interval.
try{
  setInterval(function(){
  
    var params = {
      current_voltage: voltage,
      avg_voltage: avg_packet.toFixed(2),
      max_voltage: max_voltage,
      min_voltage:min_voltage,
    };
    
    console.log("automatic-mailsent");
    
    emailjs.send(serviceID, templateID2, params)
  },20*1000);
}catch{
  console.log("err")
}
