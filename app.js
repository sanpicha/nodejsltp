const express = require('express');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

function generarToken(){
  const app_code = 'PMTZ-BANKTRS-COP-SERVER';
  const app_key = 'O7XKNGWzQCqFJsNaUTj2DqRB7xJNZm';
  const timestamp = Math.floor((new Date().getTime()) / 1000)+93;
  const key_time = app_key + timestamp;
  const uniq_token = CryptoJS.SHA256(key_time);
  const str_union = `${app_code};${timestamp};${uniq_token}`;
  const token = btoa(str_union);
  return token;
}

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/public/index.html');
})

app.post('/', (req, res) => {
const currentDate = new Date();
const currentDayOfMonth = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const dateString = currentYear + "-" +(currentMonth + 1) + "-" + currentDayOfMonth;

var jsonEnvio ={
    "user": {
        "id": "117",
        "email": req.body.correo,
        "name": req.body.nombre,
        "last_name": req.body.apellido,
        "fiscal_number": req.body.cedula
    },
    "order": {
        "dev_reference": "123",
        "description": "PRUEBA",
        "amount": req.body.monto,
        "installments_type": -1,
        "currency": "COP"       
    
    },
    "configuration": {
        "partial_payment": false,
        "expiration_days": 1,
        "allowed_payment_methods": ["All"],
        "success_url": "https://url-to-success.com",
        "failure_url": "https://url-to-failure.com",
        "pending_url": "https://url-to-pending.com",
        "review_url": "https://url-to-review.com"  
  
    }
  };
  fetch('https://noccapi-stg.paymentez.com/linktopay/init_order/', 
  {method: 'POST', body: JSON.stringify(jsonEnvio),headers:{'Content-Type':'application/json','auth-token':generarToken() }}) 
    .then(response => response.json())
    .then(datos => {
      
      res.redirect(datos.data.payment.payment_url);
      
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error al consumir la API externa' });
    });
});

const fecha = new Date();
const timestamp = `${fecha.getFullYear()}${padZero(fecha.getMonth() + 1)}${padZero(fecha.getDate())}${padZero(fecha.getHours())}${padZero(fecha.getMinutes())}${padZero(fecha.getSeconds())}`;

  function padZero(valor) {
    return valor.toString().padStart(2, '0');
  }
const merchant_secret_key ='ltNoJFPesAqVsVazh7LwoNINMGbHwDJ2GTLRAaYegaCb29r8pjQvBCi1fJySEtbh';
const cadena =CryptoJS.SHA256("4737702845234463918" + "237908" + "12345" + "12345" + "100"+ "PEN"+"711000000024035495" + timestamp + merchant_secret_key);
const checksum = cadena.toString();

raw ={
    "merchantId": "4737702845234463918",
    "merchantSiteId": "237908",
    "clientRequestId": "12345",
    "clientUniqueId": "12345",
    "amount": "100",
    "currency": "PEN",
    "relatedTransactionId": "711000000024035495",
    "urlDetails": {
    "notificationUrl": ""
    },
    "timeStamp": timestamp,
    "checksum": checksum
    };

app.get('/api', (req, res) => {
    fetch('https://noccapi-stg.paymentez.com/banks/PSE/', {headers:{'Content-Type':'application/json','auth-token':generarToken() }}) 
    
      .then(response => response.json())
      .then(data => {
        
        res.json(data); 
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'Error al consumir la API externa' });
      });
  });

  app.post('/post', (req, res) => {
    fetch('https://noccapi-stg.paymentez.com/linktopay/init_order/', 
    {method: 'POST', body: JSON.stringify(data),headers:{'Content-Type':'application/json','auth-token':generarToken() }}) 
      .then(response => response.json())
      .then(data => {
        
        res.json(data); 
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'Error al consumir la API externa' });
      });
  });

  app.post('/refund', (req, res) => {
    fetch('https://ppp-test.nuvei.com/ppp/api/v1/refundTransaction.do', 
    {method: 'POST', 
    body: JSON.stringify(raw),
    headers:{'Content-Type':'application/json' 
    }}) 
      .then(response => response.json())
      .then(data => {
        res.json(data); 
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'Error al consumir la API externa' });
      });
  });
   
  const port = 3000; 

  app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
  });
    

 
