let addbtn=document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn");
let modalcont=document.querySelector(".modal-cont")
let maincont=document.querySelector(".main-cont");
let textarea=document.querySelector(".textarea-cont");
let prioritycolor=document.querySelectorAll(".priority-color");
let toolboxcolorcont=document.querySelectorAll(".color");
let colors = ["lightpink","lightblue","lightgreen","black"];
let defaultmodalcolor=colors[colors.length-1];
let addflag=false; 
let removeflag=false;

let lock="fa-lock";
let unlock="fa-lock-open";

let ticketArr=[];

if(localStorage.getItem("task-manager"))
{
        ticketArr = JSON.parse(localStorage.getItem("task-manager"));

        ticketArr.forEach((ticketobj)=>{
          createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
        });
}

prioritycolor.forEach((colorelm,idx)=>{
        colorelm.addEventListener("click",(e)=>{
                prioritycolor.forEach((procolor,idx)=>{
                        procolor.classList.remove("border");
                })
                colorelm.classList.add("border");
                defaultmodalcolor=colorelm.classList[0];
        })
});

addbtn.addEventListener("click", (e)=>{
       
        addflag=!addflag;
        if(addflag)
        {
                modalcont.style.display="flex";
        }else{
                modalcont.style.display="none";
        }    
       
});


for(let i=0;i<toolboxcolorcont.length;i++)    
{
        
        toolboxcolorcont[i].addEventListener("click", (e)=>{

        let currtoolboxcolor = toolboxcolorcont[i].classList[1];
        
        let filtertickets=ticketArr.filter((ticketobj,idx)=>{
                return currtoolboxcolor === ticketobj.ticketcolor;

        });

        // Remove all the Existing color 

        
        let allticketcont = document.querySelectorAll(".ticket-cont");
        
        

        for(let i=0 ;i<allticketcont.length;i++)
                {
                        allticketcont[i].remove();
                }
                
        // Add the Filter color 
        console.log(filtertickets);

        filtertickets.forEach((ticketobj,idx)=>{

                createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);

        });

    });


    toolboxcolorcont[i].addEventListener("dblclick", (e)=>{

        let allticketcont = document.querySelectorAll(".ticket-cont");

        for(let i=0 ;i<allticketcont.length;i++)
                {
                        allticketcont[i].remove();
                }

        

        ticketArr.forEach((ticketobj,idx)=>{

        createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
        

        });

   });

}


removebtn.addEventListener("click",(e)=>{
        removeflag=!removeflag;
})

function handleremove(ticket,id){
        
       ticket.addEventListener("click",(e)=>{
        let idx=getticketidx(id);
        if(removeflag)
        ticket.remove();
        ticketArr.splice(idx,1);
        localStorage.setItem("task-manager",JSON.stringify(ticketArr));
       })
        
}


modalcont.addEventListener("keydown",(e)=>{
        let key=e.key;
        if(key === "Shift")
        {
                createticket(defaultmodalcolor,textarea.value);
                modalcont.style.display="none";
                addflag=false;
                textarea.value="";
                defaultmodalcolorhandler();
        }
});


function createticket(ticketcolor,tickettask,ticketid)
{
        let id = ticketid || shortid();
        let ticketcont = document.createElement("div");
        ticketcont.setAttribute("class","ticket-cont");
        ticketcont.innerHTML=`
            <div class="ticket-pripority-color ${ticketcolor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-task">${tickettask}</div>
            <div class="ticket-lock-cont">
                <i class="fa-solid fa-lock"></i>
            </div>
        `;
        maincont.appendChild(ticketcont);

        if(!ticketid)
        {
                ticketArr.push({ticketcolor,tickettask,ticketid:id});
                localStorage.setItem("task-manager",JSON.stringify(ticketArr));

        }

        handleremove(ticketcont,id);
        handleticketlock(ticketcont,id);
        handleticketcolor(ticketcont,id);
}


function handleticketlock(ticket,id){
        let ticketlockelm = ticket.querySelector(".ticket-lock-cont");
        let ticketLock = ticketlockelm.children[0];
        let tickettaskarea=document.querySelector(".ticket-task");
        ticketLock.addEventListener("click",(e)=>{
                let idx = getticketidx(id);
                if(ticketLock.classList.contains(lock))
                {
                        ticketLock.classList.remove(lock);
                        ticketLock.classList.add(unlock);
                        tickettaskarea.setAttribute("contenteditable","true");

                }else{
                        ticketLock.classList.remove(unlock);
                        ticketLock.classList.add(lock);
                        tickettaskarea.setAttribute("contenteditable","false");
                }
                // // Upadate the ticket Array
                ticketArr[idx].tickettask = tickettaskarea.innerText;
                localStorage.setItem("task-manager",JSON.stringify(ticketArr));
        })


};


function handleticketcolor(ticket,id)
{       let prioritycoloroftask=ticket.querySelector(".ticket-pripority-color"); 

        prioritycoloroftask.addEventListener("click",(e)=>{
        let idx= getticketidx(id);
        let ticketcolors = prioritycoloroftask.classList[1];

        let currticketcoloridx =  colors.findIndex((color)=>{
                return ticketcolors === color ;
        });
        // console.log(ticketcolors);
        
        let newticketcoloridx=(currticketcoloridx + 1)%colors.length;
        let newticketcolor=colors[newticketcoloridx];

        // console.log(newticketcolor);

        prioritycoloroftask.classList.remove(ticketcolors);
        prioritycoloroftask.classList.add(newticketcolor);

        ticketArr[idx].ticketcolor = newticketcolor;
        localStorage.setItem("task-manager",JSON.stringify(ticketArr));


        })    
       
}
function getticketidx(id)
{
       let index = ticketArr.findIndex((ticketobj)=>{
                return ticketobj.ticketid === id

        });

        return index;
}

function defaultmodalcolorhandler()
{
        prioritycolor.forEach((modalelm,idx)=>{
                modalelm.classList.remove("border");
        })



        defaultmodalcolor=colors[colors.length-1];
        prioritycolor[prioritycolor.length-1].classList.add("border");

}

// Concept used in the project


// 1. DOM Manipulation
// document.querySelector: Selects elements in the DOM.
// setAttribute and classList: Sets attributes or toggles classes of elements dynamically.
// innerHTML: Sets or retrieves HTML inside an element.
// appendChild: Adds a new child element to a specified parent element.
// Event Listeners: Attaches events like click, dblclick, and keydown to elements for interactive behaviors.
// contenteditable attribute: Used to make an element’s text content editable.

// 2. Events
// Click Event: Triggers an action when an element is clicked, e.g., opening the modal.
// Double-Click Event: Triggers on double-click, used here for resetting ticket filters.
// Keydown Event: Detects specific key presses (like "Shift") to create a new ticket.


// 3. Conditional Rendering
// Toggling display styles: Changes element visibility (e.g., modalcont.style.display) based on conditions.
// Flags (Booleans): addflag and removeflag control modal visibility and removal mode.
// 4. Local Storage
// localStorage.getItem and localStorage.setItem: Retrieves and saves data in the browser’s local storage, enabling persistent storage of tickets.
// JSON Parsing and Stringifying: Converts JavaScript objects to JSON for storage, and vice versa.



// 5. Data Handling
// Arrays: Used to store and manage ticket objects (ticketArr).



// Array Methods:
// forEach: Loops through arrays to create tickets or apply styles.
// filter: Filters tickets by color.
// findIndex: Finds the index of a specific ticket.



// 6. Utility Functions
// createticket: Dynamically generates ticket elements with specific properties.
// handleremove: Handles ticket removal when in remove mode.
// getticketidx: Returns the index of a ticket by its unique ID.
// defaultmodalcolorhandler: Resets the default modal color selection.



// 7. String and Class Handling
// Class Toggle: Adds or removes classes (classList.add, classList.remove) for interactive styling.
// Template Literals: Used within innerHTML for easy ticket layout generation with variable interpolation.



// 8. Short Unique ID Generation
// shortid(): Generates unique IDs for tickets to help with identification and editing.


// 9. Icons and Styling
// Font Awesome Classes (fa-lock, fa-lock-open): Adds lock/unlock functionality with icon changes.


// 10. Features to Implement
// Due Date Tracking: Future implementation to manage ticket due dates.
// Drag and Drop: Intended for ticket reordering.
// Theme Switching: Dark/light theme modes for user preference.
// Responsiveness: Making the layout suitable for mobile and tablet views.
// Archive and Restore: Ticket management with archive options.