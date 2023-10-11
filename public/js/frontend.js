function FrontEnd() {
  localStorage.removeItem("currUser");
  let me = {};

  me.showLoginError = function (message) {
    alert(message);
  };

  function isValidUsername(str) {
    const pattern = /^[a-zA-Z0-9_-]{3,10}$/;
    return pattern.test(str);
  }

  function isValidPassword(str) {
    const pattern = /^[a-zA-Z0-9@!.?]{8,16}$/;
    return pattern.test(str);
  }

  me.getInputs = function () {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");

    loginButton.addEventListener("click", async function () {
      const usernameIn = usernameInput.value;
      const passwordIn = passwordInput.value;
      if (usernameIn.trim() == "" || passwordIn.trim() == "") {
        me.showLoginError("Inputs should not be empty.");
      } else {
        if (!isValidUsername(usernameIn) && !isValidPassword(passwordIn)) {
          me.showLoginError(
            "Invalid username and password!\n\nUsername should be at least 3 and at most 10 characters long.\nShould only include letters, numbers, and -_\n\nPassword should be at least 8 and at most 16 characters long.\nShould only include letters, numbers, and @.!?"
          );
        } else if (!isValidUsername(usernameIn)) {
          me.showLoginError(
            "Invalid username!\nShould be at least 3 and at most 10 characters long.\nShould only include letters, numbers, and -_"
          );
        } else if (!isValidPassword(passwordIn)) {
          me.showLoginError(
            "Invalid password!\nShould be at least 8 and at most 16 characters long.\nShould only include uppercase and lowercase letters, numbers, and @.!?"
          );
        } else {
          const userData = {
            username: usernameIn,
            password: passwordIn,
          };
          const resUser = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          const data = await resUser.json();
          if (data.users.length == 0) {
            me.showLoginError("Wrong username or password.");
          } else {
            localStorage.setItem("currUser", JSON.stringify(data.users));
            window.location.href = "/dashboard.html";
          }
        }
      }
    });

    registerButton.addEventListener("click", function () {
      window.location.href = "/registration.html";
    });
  };

  return me;
}

const frontend = FrontEnd();
frontend.getInputs();
