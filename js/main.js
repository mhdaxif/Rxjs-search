// Observables
const { fromEvent, Observable, of, from, merge } = rxjs;
const { ajax } = rxjs.ajax;

// Operators
const { map, filter, pluck, auditTime, switchAll, tap, take, combineAll } = rxjs.operators;

var input = document.querySelectorAll("#search, #totalPick");
var total;
var sourceKeyup = fromEvent(input, "keyup");
var sourceChange = fromEvent(input, "change");

const merged = merge(sourceKeyup, sourceChange);

var sourceObs = merged.pipe(
    pluck("target", "value"),
   // filter((text) => text.length > 2),
    auditTime(2000),
    tap(_ => {
        document.querySelector(".main-wrapper").innerHTML = "";
        let val =  +document.querySelector("#totalPick").value;
        total = val <= 0 ? 5 : val;
    }),
    map((searchTerm) => {
        searchTerm = searchTerm.trim() ||  "mhdaxif";
        return doSearch(searchTerm);
    }),
    switchAll(),
    map(res => from(res.items).pipe(take(total || 5))),
    switchAll()
);

sourceObs.subscribe(
    (item) => appendItem(item),
    (err) => handleError(err) 
);

function doSearch(searchTerm) {
    return ajax.getJSON(`https://api.github.com/search/users?q=${searchTerm}`);
}

function appendItem(item) {
    let divHtml = '';
    divHtml += `<div class="col-sm-2 custom-card">
            <div class="card">
                 <img class="card-img-top" src="${item.avatar_url}" alt="Card image cap">
                 <!--  <h5 class="card-title"> ${item.login} </h5> --> 
                 <a href="${item.html_url}" class="btn btn-block"> Profile </a>
                 </div>
        </div>`;

    document.querySelector(".main-wrapper").innerHTML += divHtml;
}

function handleError(err) {
    console.log(err);
    document.querySelector(".main-wrapper").innerHTML = "<h2>Something went wrong :( See console for more information</h2>";
}