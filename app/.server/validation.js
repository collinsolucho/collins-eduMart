export function validateText(text) {
  if (text.length < 2) {
    return "Invalid input";
  }
}

export function validatePrice(price) {
  if (Number(price) <= 49) {
    return "Invalid input";
  }
}

export function validateUser(email, password, username) {
  email = String(email).trim();
  password = String(password).trim();
  username = String(username).trim();
  let errors = {};
  if (!email) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    //includes isnt in type formdataentryvalue
    //so in formdata we expect a string||file so change to string
    errors.email = "please enter a valid email adress..";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "password must be atleast 8 characters";
  }
  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  //if there is any error greater than 1

  return Object.keys(errors).length ? errors : null;
}
