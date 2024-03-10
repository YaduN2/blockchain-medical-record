(function() {
  'use strict';

  let data = {
    firstname: "John",
    lastname: "Doe",
    email: "jayem86504@rohoza.com",
    phone: "75387536895",
    weight: "65",
    height: "1.75",
    hbd: "25/05/2000",
    recent: "no",
    blood: "A+",
    address: "1234 Main St",
    role: "patient",
    password: "sdagfb58668@",
  }

  let form = document.querySelector('form');
  form.querySelector('input[name="first_name"]').value = data.firstname;
  form.querySelector('input[name="last_name"]').value = data.lastname;
  form.querySelector('input[name="email"]').value = data.email;
  form.querySelector('input[name="phone"]').value = data.phone;
  form.querySelector('input[name="weight"]').value = data.weight;
  form.querySelector('input[name="height"]').value = data.height;
  form.querySelector('input[name="hbd"]').value = data.hbd;
  form.querySelector('input[name="blood"]').value = data.blood;
  form.querySelector('input[name="address"]').value = data.address;
  form.querySelector('input[name="password"]').value = data.password;

//   form.querySelector('button[type="submit"]').click();



  // Your code here...
})(); 