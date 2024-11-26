const FORM = document.querySelector("form");
const userInput = document.querySelector(".user-input input");
const suggestion_list = document.querySelectorAll(".suggestion-list li");
const header = document.querySelector("header");
let chat_content_area = document.querySelector(".chat-content-area");
const menu_icon = document.querySelector("#menu-icon");
const close_icon = document.querySelector("#close-icon");
let userQuestion = null;
const menu_button = document.querySelectorAll(".menu-button i");
let menuBar = document.querySelector(".menu-bar");
let setting = document.querySelector(".setting-button i");
let theme = document.querySelector(".setting-button ul");
let newChat = document.querySelector(".new-chat i");
let toggleButton = document.querySelector(".fa-toggle-on");
let body = document.body;
let click = 0;

// function for new cht button
newChat.addEventListener("click", (e)=> {
    location.reload();
})

// function for darkmode on off
toggleButton.addEventListener("click", (e) =>{
    body.classList.toggle("light-mode");
    toggleButton.classList.toggle("fa-toggle-on");
    toggleButton.classList.toggle("fa-toggle-off");

})

// function for setting buttont
setting.addEventListener("click", (e)=> {
    if(theme.style.display == "none"|| click == 0 ){
        theme.style.display = "flex";
        click = 1;
    }else{
        theme.style.display = "none";
    }
});

// function for showing menu bar full and halfscreen
menu_button.forEach(element => {
    let titles = document.querySelectorAll(".menu-list  ul  li  h4");
    element.addEventListener("click", (e) => {
        if(menuBar.style.left=="0%"){
            menuBar.style.left="-7%";
            menu_icon.style.display="flex";
            close_icon.style.display="none";
            titles.forEach(title => {
                title.style.visibility="hidden";
            });
        }else{
            menuBar.style.left="0%";
            menu_icon.style.display="none";
            close_icon.style.display="flex";
            titles.forEach(title => {
                title.style.visibility="visible";
            });
        }
    })
});
// API Settlement
const YOUR_API_KEY = `AIzaSyB-5FK7lyyeRTELXgrxZXlsKSgK4vRWwmk`;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${YOUR_API_KEY}` ;

// creating user-query container
const userQueryArea = () => {
    let html = document.createElement("div");
    chat_content_area.appendChild(html);
    html.innerHTML = `<div class="outgoing-message message-container">
                          <div class="user-profile-picture profile-picture">
                              <img src="images/user-profile-icon.png" alt="user-profile-picture">
                          </div>
                          <div class="user-query message-content"></div>
                     </div>`;
    html.classList.add("user-query-container"); 
    // showing user query 
    let userQuery = html.querySelector(".outgoing-message .user-query")  ;
    userQuery.innerHTML = userInput.value;
    geminiResponseArea();
}

// function for automatically setting the scrollbar to botton
const scrollToBottom = () => {
    const height = chat_content_area.scrollHeight;
    chat_content_area.scrollBy(0, height);
}
// creating gemini-response container 
const geminiResponseArea = () => {
    let chat_content_area = document.querySelector(".chat-content-area");
    let html = document.createElement("div");
    chat_content_area.appendChild(html);
    html.innerHTML = `<div class="incoming-message message-container">
                          <div class="gemini-avatar profile-picture">
                              <img src="images/google-gemini-icon.png" alt="gemini-icon">
                          </div>
                          <div class="gemini-response message-content"></div>
                      </div>`;
    html.classList.add("response-container"); 
    let response_message_container = html.querySelector(".message-container"); 
    setTimeout(() => {
        response_message_container.classList.add("loading-message");
        loading(response_message_container);
    }, 50);
               
}

// removing loading effect
const stopLoading = (container, loading_indicator) => setTimeout(() => {
    container.classList.remove("loading-message");
    loading_indicator.remove();
}, 50);

// getting gemini respnse from api
const gettingGeminiResponse = async(container, loading_indicator)=> {
    let response = await fetch (URL, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            contents:[{
                parts :[{text : userQuestion}]}]
        })
    });
    
    let data = await response.json();
    let incoming_message = data?.candidates[0].content.parts[0].text;
    console.log(data);
    console.log(incoming_message);

    let geminiReply = container.querySelector(".gemini-response");
    let i=0;
    let words = incoming_message.split(" ");
    console.log(words)
    // for typing effect and // showing gemini response in chat
    setInterval(() => {
        if( i < words.length ){
            geminiReply.innerText += " " + words[i] ;
            i++;
        }    
        // scrollToBottom();
    }, 50);
    // removing loading bar
    stopLoading(container, loading_indicator);
    // calling scroll to bottm
    scrollToBottom();

}

// creating loading indicator and loading function
const loading = (container) => {    
    let loading_indicator = document.createElement("div");
    container.appendChild(loading_indicator);
    loading_indicator.innerHTML = `<div class="loading-bar"></div>
                                   <div class="loading-bar"></div>
                                   <div class="loading-bar"></div>`;
    loading_indicator.classList.add("loading-indicator");     
    gettingGeminiResponse(container, loading_indicator);
    
}

FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    chat_content_area.style.height = "60vh";
    header.style.display = "none"; 
    userQuestion = userInput.value;
    // let chat_content_area = document.querySelector(".chat-content-area");
    // userQueryArea(chat_content_area)
    userQueryArea();
    userInput.value="";
});

suggestion_list.forEach((list , i) => {
    suggestion_list[i].addEventListener("click", (e) => {
        let suggestion = suggestion_list[i].querySelector("h4");
        userInput.value = userQuestion = suggestion.innerHTML;
        header.style.display = "none";
        userQueryArea();
        userInput.value="";
    })
});

