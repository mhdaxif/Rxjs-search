// Observables
const { fromEvent, from } = rxjs;

// Operators
const { map, filter, pluck, auditTime, distinctUntilChanged, switchMap, tap, take} = rxjs.operators;
const { ajax } = rxjs.ajax;

var total;

var searchEle = document.querySelector("#search");
var size = document.querySelector("#totalPick");

var source = fromEvent(searchEle, "keyup");
var sourceObs = source.pipe(
    auditTime(2000), 
    pluck("target", "value"),
    filter((text) => {
        // clear previous search results
        document.querySelector(".main-wrapper").innerHTML = "";
        let val = +document.querySelector("#totalPick").value;
        total = val <= 0 ? 5 : val; 
        
        //  if length is greater than 1 
        return text.trim().length > 1; 
    }),
    distinctUntilChanged(),
    switchMap((searchTerm) => { 
        searchTerm = searchTerm.trim() || "mhdaxif";
        return doSearch(searchTerm);
    }),
    switchMap(res => from(res.items).pipe(take(total || 5))),
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