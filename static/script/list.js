let h1 = document.querySelector("h1");
let openModal = document.querySelector("#openMusicModal");
let popUP = document.querySelector("#addPopUp");
let closeModal = document.querySelector(".close");
let formAdd = document.querySelector("#addMusic");
let token = localStorage.getItem("token");
let logout = document.querySelector("#logout");
logout.addEventListener("click", async () => {
  await localStorage.clear("token");
  document.location = "index.html";
});
// add music modal
openModal.addEventListener("click", () => {
  popUP.style.display = "block";
});
closeModal.addEventListener("click", () => {
  popUP.style.display = "none";
});

//dodavanje
formAdd.addEventListener("submit", addMusic);

async function addMusic(e) {
  e.preventDefault();
  let naslov = document.querySelector("#nazivPesma").value;
  let pevac = document.querySelector("#imePevac").value;
  let tekst = document.querySelector("#textPesma").value;

  const result = await fetch("/api/addMusic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      naslov,
      pevac,
      tekst,
    }),
  }).then((response) => response.json());

  ///validacija
  let songError = document.querySelector("#songError");
  let singerError = document.querySelector("#singerError");
  let txtError = document.querySelector("#txtError");
  if (result.status === "naslov") {
    songError.innerHTML = result.naslov;
    singerError.innerHTML = "";
    txtError.innerHTML = "";
    txtError.innerHTML = "";
  }
  if (result.status === "pevac") {
    songError.innerHTML = "";
    singerError.innerHTML = result.pevac;
    txtError.innerHTML = "";
    txtError.innerHTML = "";
  }

  if (result.status === "tekst") {
    songError.innerHTML = "";
    singerError.innerHTML = "";
    txtError.innerHTML = result.tekst;

  }

  if (result.status === "ok") {
    txtError.innerHTML = "Dodato u bazu podataka";
 
  }
}

//dinamicko ucitavnaje
window.addEventListener("load", dymicLoad);
async function dymicLoad(e) {
  e.preventDefault();

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
    for (let i = 0; result.naslov.length > i; i++) {
      let container = document.querySelector("#container");
      container.innerHTML += `<section class="pesma">
              <div class="divNazivPesme">
                <p>
                  <span class="nazivPesme"> ${i+1}  ${result.naslov[i]}</span><br />
                  <span class="nazivPevaca">${result.pevac[i]}</span>
                </p>
              </div>
              <div class="popUP">
              <div class="close"><p class="close closeLyrs" >&times</p></div>
                <pre>
                 ${result.tekst[i]}
                </pre>
              </div>
            </section>
          `;
    }
  }

  let section = document.querySelectorAll(".pesma");
  let closeSec = document.querySelectorAll(".closeLyrs");
  section.forEach((e) => {
    e.addEventListener("click", async () => {
      e.className = "pessma";
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if (document.querySelector(".pessma")) {
        closeSec.forEach((element) => {
          element.addEventListener("click", () => {
            location.reload();
          });
        });
      }
    });
  });
}

///search bar

function Search(item) {
  let collection = document.getElementsByClassName("nazivPesme");
  let section = document.querySelectorAll(".pesma");

  for (i = 0; i < collection.length; i++) {
    if (collection[i].innerHTML.toLowerCase().indexOf(item) > -1) {
      section[i].style.display = "block";
    } else {
      section[i].style.display = "none";
    }
  }
}
