(function () {
  function init() {
    //register event listeners
    document
      .querySelector("#login-link")
      .addEventListener("click", showLoginForm);
    document
      .querySelector("#login-here")
      .addEventListener("click", showLoginForm);
    document
      .querySelector("#signup-link")
      .addEventListener("click", showRegisterForm);
    document
      .querySelector(".register")
      .addEventListener("click", showRegisterForm);
    document.querySelector("#register-btn").addEventListener("click", register);
    document.querySelector("#login-btn").addEventListener("click", login);

    validateSession();
  }

  // -----------------------------------
  // onSessionInvalid
  // -----------------------------------
  function onSessionInvalid() {
    let recentJob = document.querySelector("#recent-job");
    let loginForm = document.querySelector("#login-form");
    let registerForm = document.querySelector("#register-form");
    let welcomeMsg = document.querySelector("#welcome-msg");
    let favouriteJob = document.querySelector("#favourite-job");
    let loginLink = document.querySelector("#login-link");
    let logoutLink = document.querySelector("#logout-link");
    let signupLink = document.querySelector("#signup-link");

    hideElement(loginForm);
    hideElement(registerForm);
    hideElement(welcomeMsg);
    hideElement(favouriteJob);
    hideElement(logoutLink);
    clearLoginError();
    showElement(recentJob);
    showElement(loginLink);
    showElement(signupLink);
  }
  // -----------------------------------
  // onSessionValid
  // -----------------------------------
  function onSessionValid(result) {
    user_id = result.user_id;
    user_fullname = result.name;

    let recentJob = document.querySelector("#recent-job");
    let loginForm = document.querySelector("#login-form");
    let registerForm = document.querySelector("#register-form");
    let welcomeMsg = document.querySelector("#welcome-msg");
    let favouriteJob = document.querySelector("#favourite-job");
    let loginLink = document.querySelector("#login-link");
    let logoutLink = document.querySelector("#logout-link");
    let signupLink = document.querySelector("#signup-link");
    let searchBar = document.querySelector("#search-bar");

    welcomeMsg.innerHTML = "Welcome, " + user_fullname;

    hideElement(loginForm);
    hideElement(registerForm);
    hideElement(loginLink);
    hideElement(signupLink);
    showElement(searchBar);
    showElement(recentJob);
    showElement(welcomeMsg);
    showElement(favouriteJob);
    showElement(logoutLink);
  }
  // -----------------------------------
  // validateSession
  // -----------------------------------
  function validateSession() {
    onSessionInvalid();
    // The request parameters
    let url = "/jupiter/login";
    let req = JSON.stringify({});

    //display loading message
    //     showLoadingMessage('Validating session ...');

    //make AJAX call
    ajax(
      "GET",
      url,
      req,
      //session is still valid
      function (res) {
        let result = JSON.parse(res);

        if (result.status === "OK") {
          onSessionValid(result);
        }
      },
      function () {
        console.log("Login error");
      }
    );
  }

  // -----------------------------------
  // showLoginForm
  // -----------------------------------
  function showLoginForm() {
    let recentJob = document.querySelector("#recent-job");
    let loginForm = document.querySelector("#login-form");
    let registerForm = document.querySelector("#register-form");
    let welcomeMsg = document.querySelector("#welcome-msg");
    let favouriteJob = document.querySelector("#favourite-job");
    let loginLink = document.querySelector("#login-link");
    let logoutLink = document.querySelector("#logout-link");
    let signupLink = document.querySelector("#signup-link");
    let searchBar = document.querySelector("#search-bar");

    hideElement(searchBar);
    hideElement(recentJob);
    hideElement(registerForm);
    hideElement(welcomeMsg);
    hideElement(favouriteJob);
    hideElement(logoutLink);
    hideElement(loginLink);
    hideElement(signupLink);

    showElement(loginForm);
  }
  // -----------------------------------
  // showRegisterForm
  // -----------------------------------
  function showRegisterForm() {
    let recentJob = document.querySelector("#recent-job");
    let loginForm = document.querySelector("#login-form");
    let registerForm = document.querySelector("#register-form");
    let welcomeMsg = document.querySelector("#welcome-msg");
    let favouriteJob = document.querySelector("#favourite-job");
    let loginLink = document.querySelector("#login-link");
    let logoutLink = document.querySelector("#logout-link");
    let signupLink = document.querySelector("#signup-link");
    let searchBar = document.querySelector("#search-bar");

    hideElement(searchBar);
    hideElement(recentJob);
    hideElement(welcomeMsg);
    hideElement(favouriteJob);
    hideElement(logoutLink);
    hideElement(loginForm);
    hideElement(loginLink);
    hideElement(signupLink);
    clearRegisterResult();
    showElement(registerForm);
  }
  // -----------------------------------
  // Register
  // -----------------------------------
  function register() {
    let username = document.querySelector("#register-username").value;
    let password = document.querySelector("#register-password").value;
    let firstName = document.querySelector("#register-first-name").value;
    let lastName = document.querySelector("#register-last-name").value;

    if (
      username === "" ||
      password === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      showRegisterResult("Please fill in all fields");
      return;
    }

    if (username.match(/^[a-z0-9_]+$/) === null) {
      showRegisterResult("Invalid username");
      return;
    }

    password = md5(username + md5(password));

    //The request parameters
    let url = "/jupiter/register";
    let req = JSON.stringify({
      user_id: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
    });

    ajax(
      "POST",
      url,
      req,
      //successful callback
      function (res) {
        let result = JSON.parse(res);
        //successful registered
        if (result.status === "OK") {
          showRegisterResult("Successfully registered");
        } else {
          showRegisterResult("User already exists");
        }
      },
      //error
      function () {
        showRegisterResult("Failed to register");
      }
    );
  }
  // -----------------------------------
  // Login
  // -----------------------------------
  function login() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    password = md5(username + md5(password));

    //The request parameters
    let url = "/jupiter/login";
    let req = JSON.stringify({
      user_id: username,
      password: password,
    });

    ajax(
      "POST",
      url,
      req,
      //successful callback
      function (res) {
        let result = JSON.parse(res);
        //successfully loged in
        if (result.status === "OK") {
          onSessionValid(result);
        }
      },
      //error
      function () {
        showLoginError();
      }
    );
  }

  function showLoginError() {
    document.querySelector("#login-error").innerHTML =
      "Invalid username or password";
  }
  // -----------------------------------
  // Ajax function
  // -----------------------------------
  function ajax(method, url, data, success, error) {
    let xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        success(xhr.responseText);
      } else {
        error();
      }
    };

    xhr.onerror = function () {
      console.log("The request couldn't be completed.");
      error();
    };

    if (data === null) {
      xhr.send();
    } else {
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
      xhr.send(data);
    }
  }
  // -----------------------------------
  // other
  // -----------------------------------
  function clearRegisterResult() {
    document.querySelector("#register-result").innerHTML = "";
  }

  function clearLoginError() {
    document.querySelector("#login-error").innerHTML = "";
  }

  function showRegisterResult(registerMessage) {
    document.querySelector("#register-result").innerHTML = registerMessage;
  }

  function hideElement(element) {
    element.style.display = "none";
  }

  function showElement(element, style) {
    var displayStyle = style ? style : "block";
    element.style.display = displayStyle;
  }

  function showLoadingMessage(msg) {
    let itemList = document.querySelector("#item-list");
    itemList.innerHTML =
      '<p class="notice"><i class="la la-spinner la-spin"></i>' + msg + "</p>";
  }

  init();
})();
