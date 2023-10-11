function Registration() {
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
    const retypeInput = document.getElementById("retypeInput");
    const createButton = document.getElementById("createButton");
    const backButton = document.getElementById("backButton");

    createButton.addEventListener("click", async function () {
      const usernameIn = usernameInput.value;
      const passwordIn = passwordInput.value;
      const retypeIn = retypeInput.value;
      if (
        usernameIn.trim() == "" ||
        passwordIn.trim() == "" ||
        retypeIn.trim() == ""
      ) {
        me.showLoginError("Inputs should not be empty.");
      } else {
        if (!isValidUsername(usernameIn) && !isValidPassword(passwordIn)) {
          me.showLoginError(
            "Invalid username and password!\n\nUsername should be at least 3 and at most 10 characters long.\nShould only include letters, numbers, and -_\n\nPassword should be at least 8 and at most 16 characters long.\nShould only include letters, numbers, and @.!?",
          );
        } else if (!isValidUsername(usernameIn)) {
          me.showLoginError(
            "Invalid username!\nShould be at least 3 and at most 10 characters long.\nShould only include letters, numbers, and -_",
          );
        } else if (!isValidPassword(passwordIn)) {
          me.showLoginError(
            "Invalid password!\nShould be at least 8 and at most 16 characters long.\nShould only include uppercase and lowercase letters, numbers, and @.!?",
          );
        } else if (passwordIn != retypeIn) {
          me.showLoginError("Passwords do not match.");
        } else {
          const usernameData = {
            username: usernameIn,
            password: passwordIn,
          };
          const resUser = await fetch("/registration.html", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usernameData),
          });

          const data = await resUser.json();
          if (data) {
            window.location.href = "/index.html";
          } else {
            me.showLoginError("Username already exists");
          }
        }
      }
    });

    backButton.addEventListener("click", async function () {
      window.location.href = "/index.html";
    });
  };

  return me;
}

const registration = Registration();
registration.getInputs();
