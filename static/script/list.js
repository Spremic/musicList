let h1 = document.querySelector("h1");
window.addEventListener("load", dymicLoad);
async function dymicLoad(e) {
  e.preventDefault();
  let token = localStorage.getItem("token");
  const result = await fetch("/api/dynamicLoad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  }).then((response) => response.json());
  if (localStorage.getItem("token") == null) {
    document.location = "login.html";
  }

  if (result.status === "ok") {
    h1.innerHTML = `${result.nameBand}`;
  }
  if (result.status == "error") {
    h1.innerHTML = `Niste prijavljeni`;
  }
}
