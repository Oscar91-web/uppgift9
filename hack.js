const NRETRIES = 5;
const API_KEY = "books.api.key";
//const key = 'J4AL7';  // once you have a key, it is ok to store it in a variable
let key = "";
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
window.addEventListener('load', () => { //$(document).ready(function(){ samma sak?
    let localStorage = window.localStorage;
    let storageKey = localStorage.getItem(API_KEY);
    if(storageKey){
        key=storageKey;
    }

    list();
    console.log('Window load');
    $('#submit_book').click(async function(){
        console.log("submit_book");
        
        let title =$('#title').val();
        let author = $('#author').val();
        
        await addBook(title, author);
        $('#books').empty();
        list();
        
    }); //click ends here 
    $('#showstuff').click(async function(){
        $('#books').empty();
       
        list();
    });
    $('#requestkey').click(async function(){
        key = await getKey();
        if(key){
            console.log("key: " + key);
            localStorage.setItem(API_KEY, key);
        }
        else{
            console.log('unlucky');
        }       //console.log(requestKey);
    }); 

});// window load ends here
async function list(){
    console.log('funkar jag?');
        let books = await listBooks();
        console.log(books);
        if(books){
            //for(i=0; i<books.length; i++){
            for (book of books){
                
                //$('#test2').append("<div>" + "<span>Author: </span>" + book.author +" " + "<span>Title: </span>" + book.title + "</div>");
                $('#books').append('<div class="tr"><div class="td">' + book.author + '</div><div class="td">' + book.title +"</div></div>");
                
            }
        }
        else{
            $('#books').append("Something went wrong");
        }
}
async function addBook(title, author){
    
    api("&op=insert&title=" + title + "&author=" + author);
}
async function listBooks(){
    let result =  await api("&op=select");
    if (result) {
        return result.data;
    }

}
async function getKey() {
    let data = await api(null);
    return data.key;
}

async function api(params) {
    let url;
    if(params===null){
        url= baseUrl + "requestKey";
    }
    else{
        url = baseUrl + 'key=' + key + params;
    }
    console.log(url);
	for (let i = 0; i < NRETRIES; i++) {
		const response = await fetch(url);
		if (response.ok) {
			const json = await response.json();
			if (json.status === "success") {
                console.log('nice dude');
                $('#status').val("Ok").attr("style", "background-color: green");
                return json;
                
			}
			else {
                $('#status').val("Error").attr("style", "background-color: red");
				console.log("an error occurred: " + json.status + " message: " + json.message);
			}
		}
		else {
			console.log("Not ok!");
		};
	}
    return null;
    
}




