document.addEventListener('DOMContentLoaded', function () {
  function loadForm2() {
    console.log('forgot password 2 js loaded')
    const FORGOT_PASSWORD_2_FORM = document.querySelector(
      '#forgot-password-form-2',
    )

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
      }) {
        this.element = doc.querySelector(`#${id}`)
        this.parent = this.element.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.validation = validation
        this.name = name

        this.element.addEventListener('focus', () => this.cleanError())
        this.element.addEventListener('blur', () => this.handleInput())
      }

      get isValid() {
        return this.validation.test(this.element.value)
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
        if (this.error) {
          this.error.style.display = 'none'
        }
      }
    }

    class ConfirmInput extends Input {
      constructor({
        id = '',
        doc = document,
        name = undefined,
        elemId = 'signup-password',
      }) {
        super({ id, name })
        this.elem2 = doc.querySelector(`#${elemId}`)
        this.element.addEventListener('focus', () => this.cleanError())
      }

      get isValid() {
        return this.element.value === this.elem2.value
      }

      handleInput() {
        const isElem2Valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/.test(
          this.elem2.value,
        )
        if (this.element.value.length && isElem2Valid) {
          super.handleInput()
        }
      }
    }

    const forgotPassword2 = {
      code: new Input({
        id: 'forgot-password-2-code',
        name: 'forgot-password-2-code',
        validation: /[\s\S]*/,
      }),
      password: new Input({
        id: 'forgot-password-2-password',
        name: 'forgot-password-2-password',
        validation: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/,
      }),
    }
    forgotPassword2.confirmPassword = new ConfirmInput({
      id: 'forgot-password-2-confirm-password',
      name: 'forgot-password-2-confirm-password',
      elemId: 'forgot-password-2-password',
    })
    const FORGOT_PASSWORD_2_KEYS = Object.keys(forgotPassword2)

    const SUBMIT_BUTTON = FORGOT_PASSWORD_2_FORM.querySelector('#form-submit-2')
    SUBMIT_BUTTON.onclick = validate2

    var SUBMITTED_ONCE = false
    document.querySelector('#forgot-sign-in').onclick = () => {
      window.location.assign(window.location.href.replace("reset-password.html", "signin.html"))
    }
    function postSubmitInputsHandler() {
      var isAllValid = true
      for (let prop of FORGOT_PASSWORD_2_KEYS) {
        const input = forgotPassword2[prop]
        if (input.isValid === false) {
          isAllValid = false
          break
        }
      }

      return isAllValid
    }

    function loadPostSubmitHandlers() {
      for (let key of FORGOT_PASSWORD_2_KEYS) {
        const input = forgotPassword2[key]
        input.element.addEventListener('input', () => {
          if (SUBMIT_BUTTON.disabled === true) {
            SUBMIT_BUTTON.disabled = !postSubmitInputsHandler()
          }
        })
      }
    }

    function validate2(e) {
      e.preventDefault()
      SUBMIT_BUTTON.disabled = true
      let isFormValid = true

      if (SUBMITTED_ONCE === false) {
        SUBMITTED_ONCE = true
        loadPostSubmitHandlers()
      }

      const keys = Object.keys(forgotPassword2)
      for (let prop of keys) {
        const input = forgotPassword2[prop]
        input.handleInput()

        if (isFormValid == true && input.isValid === false) {
          isFormValid = false
        }
      }

      if (isFormValid === false) {
        return
      }

      // grecaptcha.execute()
      handleSubmit()
    }
    
    window.handleSubmit = handleSubmit
    async function handleSubmit(token) {
      SUBMIT_BUTTON.innerHTML = 'Saving'
      const result = await asyncSubmit(token)
      SUBMIT_BUTTON.innerHTML = 'Save'

      // let plankSuccess = document.querySelector('#plank-success-id')
      let plankError = document.querySelector('#plank-error-id-2')
      // const result = { errorMessage: null }
      if (result.errorMessage !== null) {
        plankError.classList.remove('hidden')

        const plankClose = plankError.querySelector('#plank-close-2')
        plankClose.addEventListener('click', () => {
          plankError.classList.add('hidden')
        })

        SUBMIT_BUTTON.disabled = true
      } else {
        const form3 = document.querySelector(
          '.ab-auth-content-wrap-box.reset-success-massage',
        )
        FORGOT_PASSWORD_2_FORM.classList.add('hidden')
        SUBMIT_BUTTON.disabled = false

        if (form3) {
          form3.classList.add('success-massage-open')
        }
      }
      // grecaptcha.reset()
    }

    async function asyncSubmit(token) {
      const result = { message: '', errorMessage: null, status: null }
      const res = await fetch('https://api.accbuddy.com/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmForgotPassword: {
            token: token,
            user: {
              username: window.forgotPasswordEmail,
              password: forgotPassword2.password.element.value,
              code: forgotPassword2.code.element.value,
            },
          },
        }),
      })
      const json = await res.json()
      if (!res.ok && res.status == 400) {
        const ERROR = json.error
        result.status = res.status
        result.errorMessage = ERROR
      } else if (res.ok) {
        const MESSAGE = json.result
        result.message = MESSAGE
        FORGOT_PASSWORD_2_FORM.reset()
      }
      console.log('normalized result', result)
      return result
    }

    function loadTogglePassword() {
      const imgEyes = document.querySelectorAll('.toggle-eye')
      let toggle = false

      function togglePassword() {
        toggle = !toggle
      }

      imgEyes.forEach((img) => {
        const abInputGroup = img.parentElement.parentElement
        const passwordInput = abInputGroup.querySelector(
          'input[type="password"]',
        )

        img.addEventListener('click', () => {
          togglePassword()
          passwordInput.type = toggle ? 'text' : 'password'
        })
      })
    }

    loadTogglePassword()
  }

  console.log('forgot password js loaded')

  const FORGOT_PASSWORD_FORM = document.querySelector('#forgot-password-form-1')

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
        return this.validation.test(this.element.value)
      } else if (this.validateOnEmptyOnly && this.element.value.length === 0) {
        return this.validation.test(this.element.value)
      } else {
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

  const form = {
    email: new Input({
      id: 'forgot-email',
      name: 'email',
      validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    }),
  }
  const FORM_KEYS = Object.keys(form)

  const SUBMIT_BUTTON = FORGOT_PASSWORD_FORM.querySelector('#form-submit-1')
  SUBMIT_BUTTON.onclick = validate

  var SUBMITTED_ONCE = false

  function postSubmitInputsHandler() {
    var isAllValid = true
    for (let prop of FORM_KEYS) {
      const input = form[prop]
      if (input.isValid === false) {
        isAllValid = false
        break
      }
    }

    return isAllValid
  }

  function loadPostSubmitHandlers() {
    for (let key of FORM_KEYS) {
      const input = form[key]
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
    SUBMIT_BUTTON.innerHTML = 'Sending'

    let isFormValid = true

    if (SUBMITTED_ONCE === false) {
      SUBMITTED_ONCE = true
      loadPostSubmitHandlers()
    }

    const keys = Object.keys(form)
    for (let prop of keys) {
      const input = form[prop]
      input.handleInput()
      if (isFormValid == true && input.isValid === false) {
        isFormValid = false
      }
    }

    if (isFormValid === false) {
      return
    }
    grecaptcha.execute()
    // handleSubmit()
  }

  window.handleSubmit = handleSubmit
  async function handleSubmit(token) {
    let email = form.email.element.value
    SUBMIT_BUTTON.disabled = true
    const result = await asyncSubmit(token)
    SUBMIT_BUTTON.innerHTML = 'Next'
    let plankError = document.querySelector('#plank-error-id')
    // const result = { errorMessage: null }
    if (result.errorMessage !== null) {
      plankError.classList.remove('hidden')

      const plankClose = plankError.querySelector('#plank-close')

      SUBMIT_BUTTON.disabled = false

      plankClose.addEventListener('click', () => {
        plankError.classList.add('hidden')
      })

      SUBMIT_BUTTON.disabled = true
    } else {
      loadForm2()
      window.forgotPasswordEmail = email
      const confirmPasswordForm = document.querySelector(
        '#forgot-password-form-2',
      )

      if (confirmPasswordForm) {
        FORGOT_PASSWORD_FORM.classList.add('hidden')
        confirmPasswordForm.classList.remove('hidden')
      }
    }
    grecaptcha.reset()
  }

  async function asyncSubmit(token) {
    const result = { message: '', errorMessage: null, status: null }
    const res = await fetch('https://api.accbuddy.com/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        forgotPassword: {
          token: token,
          user: {
            username: form.email.element.value,
          },
        },
      }),
    })
    const json = await res.json()
    if (!res.ok && res.status == 400) {
      const ERROR = json.error
      result.status = res.status
      result.errorMessage = ERROR
    } else if (res.ok) {
      const MESSAGE = json.result
      result.message = MESSAGE
      FORGOT_PASSWORD_FORM.reset()
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
    FORGOT_PASSWORD_FORM.appendChild(divRecaptcha)

    loadScript()
  }

  loadScriptOnce()

  //   function loadTogglePassword() {
  //     const imgEyes = document.querySelectorAll('.toggle-eye')
  //     let toggle = false

  //     function togglePassword() {
  //       toggle = !toggle
  //     }

  //     imgEyes.forEach((img) => {
  //       const abInputGroup = img.parentElement.parentElement
  //       const passwordInput = abInputGroup.querySelector('input[type="password"]')

  //       img.addEventListener('click', () => {
  //         togglePassword()
  //         passwordInput.type = toggle ? 'text' : 'password'
  //       })
  //     })
  //   }

  //   loadTogglePassword()
})
