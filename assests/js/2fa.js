

async function generateTOTP(secret ) {
    const totp = new OTPAuth.TOTP({
        issuer: 'Example',
        label: 'MyAccount',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Generate the OTP token
      return totp.generate();
  }

async function submit(){
    const secretCodeInput = document.getElementById('secret-code');
    const secretCodeValue = secretCodeInput.value
    const cleanSecret = secretCodeValue.replaceAll(" ","")
    
    
    const otpCode =await generateTOTP(cleanSecret );
    const twoFactorCodeInput = document.getElementById('2fa-code');
    twoFactorCodeInput.value = otpCode;
    const container = document.getElementById('2fa-container');
    container.classList.add('generated-code');
}
function copyToClipboard() {
    const inputElement = document.getElementById('2fa-code');
    
    // Select the content of the input field
    inputElement.select();

    navigator.clipboard.writeText(inputElement.value);

    // Deselect the input field to avoid visual disturbance
    window.getSelection().removeAllRanges();
  }