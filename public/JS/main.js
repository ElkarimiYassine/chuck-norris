const Btn = document.getElementById('deleteBtn');
const GenerateBtn = document.getElementById('GenerateBtn');
const test = document.getElementById('test');

function deleteJoke() {
    const id = Btn.getAttribute('data-id');
    axios.delete('/jokes/delete/'+id)
         .then(function (response) {
            console.log(response.data);
            alert('Jokes was deleted successfully');
            window.location.href='/jokes';
        }).catch((err) => {
            console.log(err);
        })
}

function Generate(){
    let inputJoke = document.getElementById('JokeInput');
    axios.get("https://api.chucknorris.io/jokes/random")
         .then((res)=>{
           const Joke = res.data;
           inputJoke.value = Joke.value;
       }).catch(err =>{
        console.log(err);
       })
}