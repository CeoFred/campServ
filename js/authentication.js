var email_login = document.getElementById('email_login')
var password_login = document.getElementById('password_login')

var loginBtn = document.getElementById('loginDialogueBtn')
var artisanRoleBtn = document.getElementById('artisanRole')
var regularRoleBtn = document.getElementById('regularRole')
var role = 'regular';

let signupForm = document.getElementById('signup_form___')
let signup_btn = document.getElementById('signup_btn');

const artisanFormInput = `
<div class="cfield">
<input type="text" placeholder="first name" id="first_name" name="First Name" />
<i class="la la-phone"></i>
</div>

<div class="cfield">
<input type="text" placeholder="last name" id="last_name" name="Last Name" />
<i class="la la-phone"></i>
</div>



<div class="cfield">
    <input type="email" placeholder="Email" id="email" name="email"/>
    <i class="la la-envelope"></i>
</div>

<div class="cfield">
<input type="text" placeholder="Phone Number" id="phone_number" name="phone" />
<i class="la la-phone"></i>
</div>


<div class="cfield">
<input type="text" placeholder="Location" id="location" name="location" />
<i class="la la-map-pin"></i>
</div>

<div class="dropdown-field">
<select id="category" data-placeholder="Please Select Specialism" class="chosen">
    <option>Graphics Desingn</option>
    <option>Software Development</option>
    <option>Art & Culture</option>
    <option value="marketer">Marketer</option>
    <option>Reading & Writing</option>
    <option value="elec">Electricals</option>
    <option value="elec">Plumbing</option>
    <option value="elec">Wood work</option>
</select>
</div>


<div class="cfield">
<input type="password" id="password" name="password" placeholder="Password" />
<i class="la la-key"></i>
</div>

<div class="cfield">
<input type="password" id="confirm_password" name="confirm" placeholder="confirm Password" />
<i class="la la-key"></i>
</div>


<button type="submit" id="signup_btn">Signup</button>

`

const regularFormInput = `
<div class="cfield">
    <input type="email" placeholder="Email" id="email" name="phone" />
    <i class="la la-envelope"></i>
</div>

<div class="cfield">
<input type="text" placeholder="Phone Number" id="phone_number" name="phone"/>
<i class="la la-phone"></i>
</div>

<div class="cfield">
<input type="password" id="password" name="password" placeholder="Password" />
<i class="la la-key"></i>
</div>

<div class="cfield">
<input type="password" id="confirm_password" name="confirm" placeholder="confirm Password" />
<i class="la la-key"></i>
</div>


<button type="submit" id="signup_btn">Signup</button>
`

if (loginBtn) {
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        this.innerHTML = 'Attempting...'
        this.disabled = true
        this.style.backgroundColor = '#757aa0'

        if (window.localStorage.getItem('ut')) {
            //verify tokem and redirect
        }
        handleLoginFromHome(this);
    })
}


artisanRoleBtn.addEventListener('click', function (e) {

    setForm('artisan')
})
regularRoleBtn.addEventListener('click', function (e) {
    setForm('regular')
})




 function signupAction (e) {
    e.preventDefault()
    signup_btn.style.backgroundColor = '#8d90ad'
    signup_btn.disabled =  true
    signup_btn.innerHTML = 'Please wait..'

    const location = document.getElementById('location') ? document.getElementById('location').value : null
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const category =  document.getElementById('category') ? document.getElementById('category').value : null
    const phonenumber =  document.getElementById('phone_number').value
    const confirm_password = document.getElementById('confirm_password').value
    const firstname =  document.getElementById('first_name') ? document.getElementById('first_name').value : null
    const lastname = document.getElementById('last_name') ? document.getElementById('last_name').value : null
             data = {
                email,
                password,
                confirm_password,
                phone:phonenumber,
                category,
                location,
                lastname,
                firstname,
                role
            }
        console.log(data)
   
     $.ajax({
        url:'http://localhost:6060/api/auth/rg',
        data,
        method:'POST'
    }).done(data => {
        console.log(data)
        iziToast.success({
            title: 'Great!',
            message: `Account created successfully`,
            position: 'topRight',
        })
        signup_btn.style.backgroundColor = '#26ae61'
        signup_btn.innerHTML = 'Please wait..'
        setTimeout(() => {
            window.location.href = 'login.html?utm-source=register'
        }, 3000);
    }).fail(err => {
        signup_btn.disabled = false
        signup_btn.innerHTML = 'Signup'
        signup_btn.style.backgroundColor = '#141f72'

        if(err.responseJSON.status_code === 409){
            iziToast.warning({
                title: 'Opps!',
                message: `${err.responseJSON.message}`,
                position: 'topRight',
            })
        }
        console.error(err)
    })
}

function setForm(type) {
    role = type;
    setFormInputs();
}


function setFormInputs() {
        signupForm.innerHTML = '';
    if (role == 'artisan') {
        signupForm.innerHTML = artisanFormInput
    } else {
        signupForm.innerHTML = regularFormInput
    }

}

function handleLoginFromHome(button) {
    // login credentials on submit
    data = {
        email: email_login.value,
        password: password_login.value
    }
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            if (element === '') {
                iziToast.warning({
                    title: 'Opps!',
                    message: `${key} cannot be left empty`,
                    position: 'topRight',
                })
                button.disabled = false
                button.innerHTML = 'Login'
                button.style.backgroundColor = '#141f72'

                return false;
            }
        }
    }

    $.ajax({
        url: 'http://localhost:6060/api/auth/lg',
        data,
        method: 'POST'
    }).done(data => {
        console.log(data)
        if (data.message.token !== false) {

            button.innerHTML = 'Redirecting'

            iziToast.success({
                title: 'Great!',
                message: 'Authentication was successfull,please wait ...',
                position: 'topRight',
            })
            window.localStorage.setItem('ut', data.message.token);

            var urlParams = new URLSearchParams(window.location.search)

            if (urlParams.has('continue') || urlParams.has('prev')) {
                continueUrl = urlParams.get('continue')
                setTimeout(() => {
                    window.location.href = continueUrl + `auth=true&ut=${window.localStorage.getItem('ut')}`
                }, 3000)

            } else {
                continueUrl = false;
                setTimeout(() => {
                window.location.href = 'index.html?t=' + window.localStorage.getItem('ut') + '&auth=true&ft=true'
            }, 3000)

            }




        } else {
            
            button.disabled = false
            button.innerHTML = 'Login'
            button.style.backgroundColor = '#141f72'

            iziToast.warning({
                title: 'Opps!',
                message: data.message
            })
            console.log(data)
        }
    }).fail(err => {
        
        button.disabled = false
        button.innerHTML = 'Login'
        button.style.backgroundColor = '#141f72'
        
        iziToast.error({
            title: 'Opps!',
            message: err.responseJSON.message
        })
        console.log(err)
    })

}


