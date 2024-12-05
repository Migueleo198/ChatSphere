
  function sendEmail(){  
    var emailSentCorrectly = true; 

    
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.marginTop = '50px';

    
    let emailSentMessage = document.createElement('h1');
    emailSentMessage.textContent = emailSentCorrectly ? 'Mail sent Succesfully.' : 'There was an error sending the mail.';
    container.appendChild(emailSentMessage);

   
    const returnButton = document.createElement('button');
    returnButton.textContent = 'Return';
    returnButton.style.padding = '10px 20px';
    returnButton.style.marginTop = '20px';
    returnButton.style.fontSize = '16px';

    
    returnButton.addEventListener('click', function() {
      
        window.location.href = './login.html'; 
    });

    
    container.appendChild(returnButton);

    
    document.body.innerHTML = ''; 
    document.body.appendChild(container);
}


sendEmail();
