var email_login = document.getElementById('email_login');
var password_login = document.getElementById('password_login');
var loginBtn = document.getElementById('loginDialogueBtn');


loginBtn.addEventListener('click',function(e){
    e.preventDefault();
    handleLoginFromHome();
})
function handleLoginFromHome() {

    // login credentials on submit
    data = {
        email:email_login.value,
        password:password_login.value
    }
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            if(element === ''){
                iziToast.warning({
                    title:'Opps!',
                    message:`${key} cannot be left empty`,
                    position:'topRight',
                })

                return false;
            }
        }
    }

   $.ajax({
        url:'http://localhost:6060/api/auth/lg',
        data,
        method:'POST'
    }).done(data => {
        console.log(data)
        if(data.message.token !== false){
            loginBtn.disabled = true;
            iziToast.success({
                title:'Great!',
                message:'Authentication was successfull,please wait ...',
                position:'topRight',
            })
            window.localStorage.setItem('ut',data.message.token);
            
               let query = window.location.search.split('continue');
               location = query[1].split('=')
               let newLocation = location[1]
           
            setTimeout(() => {
                window.location.href = ''
            },3000)

        }else{
            iziToast.error({
                title:'Opps!',
                message:'Something went wrong,please try again'
            })
        }
    }).fail(err => {
        console.log(err)
    })

}

