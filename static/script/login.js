let forma = document.querySelector("#formLogin");
let gitLink = document.querySelector("#gitHub");
gitLink.addEventListener("click", () => {
  window.open("https://github.com/Spremic");
});

forma.addEventListener("submit", login);
async function login(e) {
  e.preventDefault();
  let password = document.querySelector("#password").value;
  let email = document.querySelector("#email").value;

  const result = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());

  if (result.status === "OK") {
    localStorage.setItem("token", result.token);
    console.log(result.token);
    document.location = "list.html";
  }

  if (result.status === "mail") {
    alert("konje");
  }
  if (result.status === "password") {
    alert("password konju");
  }
}
if (localStorage.getItem("token") !== null) {
  document.location = "list.html";
}
