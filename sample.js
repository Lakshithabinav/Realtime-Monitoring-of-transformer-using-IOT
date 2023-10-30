var packet;
let packet_list = [];
var max_voltage = 0;
var min_voltage = 600;
var avg_packet;
var voltage;
var val = 0;
var i;
var sum = 0;
var len;

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
      setTimeout(function() {
        popup.style.display = "none";
      }, 10000);

      console.log("Serial Port Opened");

      const reader = port.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("Reader has been canceled");
          break;
        }

        // To display the voltage at the HTML page.
        packet = new TextDecoder().decode(value).trim();
        voltage = parseInt(packet);
        if(voltage!=0){
          voltage-=20;
        }
        
        

        if (!isNaN(voltage)) {
          packet_list.push(voltage);
          document.getElementById("pac").innerHTML = voltage;
        }
        

        if ((packet_list.length >= 10) && (voltage>0)) {


            // send mail if voltmeter is not connected.
          if(voltage<100 ){
            try{
              console.log("Current Packet: ", packet);
              console.log("Avg",avg_packet.toFixed(2));
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! Adreno not connected to supply!",
                sub:"Power failure"
              };
              const serviceID = "service_siorhhm";
              const templateID = "template_navtuwq";
              console.log("alert-mailsent-power failure");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
            }
            catch{
              console.log("err");
            }
          }
  
          //send mail if voltage is low.The voltmeter is connected.
          else if((voltage<200) && (voltage>100)){
            try{
              
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! voltage reached lower the limit",
                sub:"Under voltage"
              };
              const serviceID = "service_siorhhm";
              const templateID = "template_navtuwq";
              console.log("alert-mailsent-lower voltage");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
            }
            catch{
              console.log("err");
            }
          }
  
          //send mail if voltage if high.
          else if(voltage> 290 ){
            try{
              
            
              var params = {
                current_voltage: voltage,
                mesage:"Alert ! voltage reached higher the limit",
                sub:"Over voltage!"
              };
              const serviceID = "service_siorhhm";
              const templateID = "template_navtuwq";
              console.log("alert-mailsent-high");
              
              emailjs.send(serviceID, templateID, params);
              val=1;
            }
            catch{
              console.log("err");
            }
          }
          else{
            val=0;
          }
          //max-voltage
          if (voltage > max_voltage && voltage < 450) {
            max_voltage = voltage;
          }
          

          // Min-voltage.
          if (voltage === 0 || (voltage < min_voltage && voltage > 200)) {
            min_voltage = voltage;
          }
          len = packet_list.length;
          sum = 0; // Initialize the sum variable
        
            for (i = 11; i < len; i++) {
              sum += packet_list[i]; // Accumulate the sum of elements
            }
            avg_packet = sum / (len-11); // Calculate the average
          

          document.getElementById("avg").innerHTML = avg_packet.toFixed(1);
          document.getElementById("max").innerHTML = max_voltage;
          document.getElementById("min").innerHTML = min_voltage;

          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
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
    console.log("Current Packet: ", packet);
    console.log("Avg",avg_packet.toFixed(2));
  
    var params = {
      current_voltage: voltage,
      avg_voltage: avg_packet.toFixed(2),
      max_voltage: max_voltage,
      min_voltage:min_voltage,
    };
    const serviceID = "service_siorhhm";
    const templateID = "template_m14v3ga";
    
    emailjs.send(serviceID, templateID, params)
    alert("Your message sent successfully!!")
  }
  
  //To send mail automatically for every time interval.
  try{
    setInterval(function(){
    
      var params = {
        current_voltage: ,
        avg_voltage: avg_packet.toFixed(2),
        max_voltage: max_voltage,
        min_voltage:min_voltage,
      };
      const serviceID = "service_siorhhm";
      const templateID = "template_m14v3ga";
      console.log("automatic-mailsent");
      
      emailjs.send(serviceID, templateID, params)
    },20*1000);
  }catch{
    console.log("err")
  }
  