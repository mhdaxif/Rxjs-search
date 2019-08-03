// Observables
const { fromEvent, from } = rxjs;

// Operators
const { map, filter, pluck, debounceTime, distinctUntilChanged, switchMap, tap, take} = rxjs.operators;
const { ajax } = rxjs.ajax;

var searchEle = document.querySelector("#search");

var source = fromEvent(searchEle, "keyup");
var sourceObs = source.pipe(
    debounceTime(500), 
    pluck("target", "value"),
    filter((text) => {
        // clear previous search results
        document.querySelector(".main-wrapper").innerHTML = "";
        //  if length is greater than 1 
        return text.trim().length > 1; 
    }),
    //distinctUntilChanged(),
    switchMap((searchTerm) => { 
        searchTerm = searchTerm.trim() || "mhdaxif";
        return doSearch(searchTerm);
    }), 
    switchMap(res => from(res.items)),
);

sourceObs.subscribe(
    (item) => appendItem(item),
    (err) => handleError(err)
);

function doSearch(searchTerm) {
    return ajax.getJSON(`https://api.github.com/search/users?q=${searchTerm}`);
}

function appendItem(item) {
    let divHtml = ``;
    divHtml += `
        <div class="col-sm-3 m-sm-auto">
            <div class="row align-items-center">
                <div class="col-4">
                    <img alt="image" class="img-fluid rounded-circle" src="${item.avatar_url}">
                </div>

                <div class="col-8">
                    <h3> <a href="https://github.com/${item.login}"> ${item.login} </a></h3>
                </div>
            </div>
        </div>
   `;

    document.querySelector(".main-wrapper").innerHTML += divHtml;
}

function handleError(err) {
    console.log(err);
    document.querySelector(".main-wrapper").innerHTML = "<h2>Something went wrong :( See console for more information</h2>";
}