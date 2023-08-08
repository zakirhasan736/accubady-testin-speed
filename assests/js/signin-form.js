document.addEventListener('DOMContentLoaded', function () {
  console.log('signin js loaded')

  const SIGNIN_FORM = document.querySelector('#signin-form')

  class Input {
    // onblur will validate
    // onfocus will clean
    // submit button remains active until invalid submit
    // submit button becomes active when all inputs are valid
    // show all errors on invalid submit

    constructor({
      id = '',
      doc = document,
      name = undefined,
      validation = '',
      validateOnEmptyOnly = false,
    }) {
      this.element = doc.querySelector(`#${id}`)
      this.parent = this.element.parentElement
      this.error = this.parent.querySelector('.alart-text')
      this.validation = validation
      this.name = name
      this.validateOnEmptyOnly = validateOnEmptyOnly

      this.element.addEventListener('focus', () => this.cleanError())
      this.element.addEventListener('blur', () => this.handleInput())
    }

    get isValid() {
      if (this.validateOnEmptyOnly === false) {
        console.log('here')
        return this.validation.test(this.element.value)
      } else if (this.validateOnEmptyOnly && this.element.value.length === 0) {
        console.log('here1')
        return this.validation.test(this.element.value)
      } else {
        console.log('here2')
        return true
      }
    }

    handleInput() {
      if (false === this.isValid) {
        this.parent.classList.add('warning')
        this.error.style.display = 'flex'
      } else {
        if (Input.HAS_SUBMITTED && Input.ALL_VALID) {
          SUBMIT_BUTTON.disabled = false
        }
        this.cleanError()
      }
    }

    cleanError() {
      this.parent.classList.remove('warning')
      this.error.style.display = 'none'
    }
  }

  const signinForm = {
    email: new Input({
      id: 'signin-email',
      name: 'email',
      validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    }),
    password: new Input({
      id: 'signin-password',
      name: 'password',
      validateOnEmptyOnly: true,
      validation: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/,
    }),
  }
  const SIGN_IN_KEYS = Object.keys(signinForm)

  const SUBMIT_BUTTON = SIGNIN_FORM.querySelector('#signin-submit')
  SUBMIT_BUTTON.onclick = validate

  var SUBMITTED_ONCE = false

  function postSubmitInputsHandler() {
    var isAllValid = true
    for (let prop of SIGN_IN_KEYS) {
      const input = signinForm[prop]
      if (input.isValid === false) {
        isAllValid = false
        break
      }
    }

    return isAllValid
  }

  function loadPostSubmitHandlers() {
    for (let key of SIGN_IN_KEYS) {
      const input = signinForm[key]
      input.element.addEventListener('input', () => {
        if (SUBMIT_BUTTON.disabled === true) {
          SUBMIT_BUTTON.disabled = !postSubmitInputsHandler()
        }
      })
    }
  }

  function validate(e) {
    e.preventDefault()
    SUBMIT_BUTTON.disabled = true
    let isFormValid = true

    if (SUBMITTED_ONCE === false) {
      SUBMITTED_ONCE = true
      loadPostSubmitHandlers()
    }

    const keys = Object.keys(signinForm)
    for (let prop of keys) {
      const input = signinForm[prop]
      input.handleInput()
      if (isFormValid == true && input.isValid === false) {
        isFormValid = false
      }
    }

    if (isFormValid === false) {
      return
    }
    grecaptcha.execute()
  }

  window.handleSubmit = handleSubmit
  async function handleSubmit(token) {
    let email = signinForm.email.element.value
    SUBMIT_BUTTON.disabled = true
    SUBMIT_BUTTON.innerHTML = 'Signing in'
    const result = await asyncSubmit(token)
    SUBMIT_BUTTON.innerHTML = 'Sign in'

    // let plankSuccess = document.querySelector('#plank-success-id')
    let plankError = document.querySelector('#plank-error-id')
    let content1 = SIGNIN_FORM.querySelector('.ab-input-group-content-box')
    let content2 = SIGNIN_FORM.querySelector('.ab-auth-content-wrap-box')
    let pError = plankError.querySelector('.plank')
    console.log('result', result)
    if (result.errorMessage !== null) {
      plankError.classList.remove('hidden')

      const plankClose = plankError.querySelector('#plank-close')
      if (result.errorMessage === 'NotAuthorizedException') {
        pError.innerText = 'Incorrect password.'
      } else if (result.errorMessage === 'UserNotConfirmedException') {
        plankError.classList.add('hidden')
        content1.style.display = 'none'
        content2.style.display = 'flex'
        // SIGNIN_FORM.querySelector('#user-email').innerText = email
        const h6 = SIGNIN_FORM.querySelector('#resend-email-btn')
        h6.addEventListener('click', async () => {
          const h6Inactive = SIGNIN_FORM.querySelector(
            '#resend-email-btn-inactive',
          )
          h6.style.display = 'none'
          h6Inactive.style.display = 'block'
          const resendTimer = SIGNIN_FORM.querySelector('#resend-timer')

          const res = await resendEmail(email)
          if (res.errorMessage === null) {
            // SIGNIN_FORM.querySelector('#sent-resent').innerText = 're-sent'
            // h6.removeEventListener('click')

            // make resent-email-btn-inactive show
            const timer = setInterval(() => {
              if (resendTimer) {
                resendTimer.innerText = parseInt(resendTimer.innerText) - 1
                if (resendTimer.innerText === '0') {
                  clearInterval(timer)
                  resendTimer.innerText = '59'
                  h6.style.display = 'block'
                  h6Inactive.style.display = 'none'
                }
              } else {
                console.log('resendTimer does not exist')
              }
            }, 1000)
            SIGNIN_FORM.querySelector('#resend-ok').addEventListener(
              'click',
              () => {
                clearInterval(timer)
                resendTimer.innerText = '59'
                window.location.assign(
                  window.location.href.replace('signin.html', 'index.html'),
                )
              },
            )
          } else {
            const h6Inactive = SIGNIN_FORM.querySelector(
              '#resend-email-btn-inactive',
            )
            h6.style.display = 'none'
            h6Inactive.style.display = 'block'
            h6Inactive.innerText = 'Resend limit exceeded'
          }
        })

        SIGNIN_FORM.querySelector('#resend-ok').addEventListener(
          'click',
          () => {
            window.location.assign(
              window.location.href.replace('signin.html', 'index.html'),
            )
          },
        )

        SUBMIT_BUTTON.disabled = false
      }

      plankClose.addEventListener('click', () => {
        plankError.classList.add('hidden')
      })

      SUBMIT_BUTTON.disabled = true
    } else {
      window.location.assign(
        window.location.href.replace('signin.html', 'index.html'),
      )
    }
    grecaptcha.reset()
  }

  async function resendEmail(email) {
    const result = { message: '', errorMessage: null, status: null }
    const res = await fetch('https://api.accbuddy.com/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resendConfirmation: {
          token: '',
          user: {
            username: email,
          },
        },
      }),
    })
    const json = await res.json()

    if (!res.ok && res.status == 400) {
      console.log('json response', json)
      const ERROR = json.error
      result.status = res.status
      result.errorMessage = ERROR
    } else if (res.ok) {
      const MESSAGE = json.result
      result.message = MESSAGE
      SIGNIN_FORM.reset()
    }

    console.log('resend result', result)
    return result
  }

  async function asyncSubmit(token) {
    const result = { message: '', errorMessage: null, status: null }

    const res = await fetch('https://api.accbuddy.com/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signin: {
          token: token,
          user: {
            username: signinForm.email.element.value,
            password: signinForm.password.element.value,
          },
        },
      }),
    })
    const json = await res.json()
    if (!res.ok && res.status == 400) {
      console.log('json response', json)
      const ERROR = json.error
      result.status = res.status
      result.errorMessage = ERROR
    } else if (res.ok) {
      const MESSAGE = json.result
      result.message = MESSAGE
      SIGNIN_FORM.reset()
    }
    console.log('normalized result', result)
    return result
  }

  function loadScriptOnce() {
    let isGrecaptachaLoaded = false

    // closure is utilized to implement boolean variable for loading once condition
    function loadScript() {
      // every focus of inputs will go check if it is loaded
      // because of closure, isGrecaptachaLoaded will be always tracked by loadscript function
      if (!isGrecaptachaLoaded) {
        const script = document.createElement('script')
        script.src = 'https://www.google.com/recaptcha/api.js'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        isGrecaptachaLoaded = true
      }
    }

    const div = document.createElement('div')
    div.innerHTML =
      "<div class='g-recaptcha' data-sitekey='6LcShYkmAAAAAA_FN5w0Oewh_-7XzIocjZlX6apw'data-callback='handleSubmit' data-size='invisible'></div>"
    const divRecaptcha = div.firstElementChild
    SIGNIN_FORM.appendChild(divRecaptcha)

    loadScript()
  }

  loadScriptOnce()

  function loadTogglePassword() {
    const imgEyes = document.querySelectorAll('.toggle-eye')
    let toggle = false

    function togglePassword() {
      toggle = !toggle
    }

    imgEyes.forEach((img) => {
      const abInputGroup = img.parentElement.parentElement
      const passwordInput = abInputGroup.querySelector('input[type="password"]')

      img.addEventListener('click', () => {
        togglePassword()
        passwordInput.type = toggle ? 'text' : 'password'
      })
    })
  }

  loadTogglePassword()

  // SIGNIN_FORM.querySelector('.ab-input-group-content-box').style.display = 'none'

  // let plankSuccess = document.querySelector('#plank-success-id')
  // let plankError = document.querySelector('#plank-error-id')

  // plankSuccess.classList.remove("hidden")
  // plankError.classList.add("hidden")

  // const plankClose = plankSuccess.querySelector("#plank-close")
  // plankClose.addEventListener('click', () => {
  //     plankSuccess.classList.add("hidden")
  // })

  // SUBMIT_BUTTON.disabled = false
})
