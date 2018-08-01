var baseUrl = 'http://dct-api-data.herokuapp.com';

var countHandle = document.getElementById('count');
var tableBodyHandle = document.getElementById('tableBody');
var ticketFormHandle = document.getElementById('ticketForm');
var alertHandle = document.getElementById('alert'); 

var nameHandle = document.getElementById('name');
var departmentHandle = document.getElementById('department');
var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('priority'); 
var messageHandle = document.getElementById('message');
var nameErrorHandle = document.getElementById('nameError'); 
var depErrorHandle = document.getElementById('depErr'); 
var priErrorHandle = document.getElementById('priorityErr');

var messageErrorHandle = document.getElementById('messageErr');
var searchHandle = document.getElementById('search');

var selectHandle = document.getElementById('select');

var totalHandle = document.getElementById('total');

/*
var allHandle = document.getElementById('all');
var highHandle = document.getElementById('high');
var mediumHandle = document.getElementById('medium');
var lowHandle = document.getElementById('low');*/



var tickets,completeCount;

var progressHandle = document.getElementById('progress');

function buildProgress()
{
  var percentage = (completeCount/tickets.length)*100;
  progressHandle.setAttribute("style",`width: ${percentage}%`);
  progressHandle.innerHTML = percentage.toFixed(2);
}

function statuss(ticketCode) {
    var tick = document.getElementById(ticketCode);
    var parent = tick.parentNode;
    if(tick.checked)
    {
        axios.put(`${baseUrl}/tickets/${ticketCode}?api_key=${key}`,{status : 'completed'})
        .then(response => {
           var ticket = response.data;
           parent.childNodes[1].innerHTML = ticket.status;
           completeCount++; 
           buildProgress();
        })
        .catch(err => {
            console.log(err);
        });
    }
    else{
        axios.put(`${baseUrl}/tickets/${ticketCode}?api_key=${key}`,{status : 'open'})
        .then(response => {
           var ticket = response.data;
           parent.childNodes[1].innerHTML = ticket.status;
           completeCount--; 
           buildProgress();
        })
        .catch(err => {
            console.log(err);
        });
    }
    
}





function buildRow(ticket,i){
    var tr = document.createElement('tr');
    if(ticket.status === 'completed')
    {
    tr.innerHTML = `
        <td>${i+1}</td>
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td> 
        <td><input type="checkbox" id="${ticket.ticket_code}" checked onclick="statuss(this.id)"><span>${ticket.status}</span></td>`;
    } else {
        tr.innerHTML = `
        <td>${i+1}</td>
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td> 
        <td><input type="checkbox" id="${ticket.ticket_code}" onclick="statuss(this.id)"><span>${ticket.status}</span></td>`;
    }
   
    tableBodyHandle.appendChild(tr); 

    setTimeout(() => {
        alertHandle.innerHTML = 
        ``; 
    }, 5000);
}

function getTickets() {
axios.get(`${baseUrl}/tickets?api_key=${key}`)
.then(function(response){
    tickets = response.data; 
    countHandle.innerHTML = tickets.length; 
    tickets.forEach(function(ticket,i){
        buildRow(ticket,i); 
    })
    completeCount = tickets.filter(ele => ele.status === 'completed').length;
            buildProgress();
})
.catch(function(err){
console.log(err);
})
}

function getPriorityValue(){
    for(var i = 0; i < priorityNames.length; i++) {
        if(priorityNames[i].checked){
            return priorityNames[i].value; 
        }
    }
}

var hasErrors = {
    name: true,
    department: true,
    priority: true,
    message: true
}

function validateName() {
    if(nameHandle.value == '') {
        nameErrorHandle.innerHTML = '**can not be empty';
        hasErrors.name = true; 
    } else {
        nameErrorHandle.innerHTML = '';
        hasErrors.name = false; 
    }
}

function validateDepartment() {
    if(departmentHandle.value == "") {
        depErrorHandle.innerHTML = '**select any one';
        hasErrors.department = true; 
    } else {
        depErrorHandle.innerHTML = '';
        hasErrors.department= false; 
    }
}
function validatePriority() {
    for(var i = 0; i < priorityNames.length; i++) {
    if(priorityNames[i].checked === false ) {
        priErrorHandle.innerHTML = '**select any one';
        hasErrors.priority = true; 
    
    }else {
        priErrorHandle.innerHTML = '';
        hasErrors.priority = false; 
        break;
    }
}
}

function validateMessage() {
    if(messageHandle.value == '') {
        messageErrorHandle.innerHTML = '**can not be empty';
        hasErrors.message = true; 
    } else {
        messageErrorHandle.innerHTML = '';
        hasErrors.message = false; 
    }
}

ticketFormHandle.addEventListener('submit', function(e){//e = object
    validateName();
    validateDepartment();
    validatePriority();
    validateMessage();
    if(Object.values(hasErrors).includes(true)){
        e.preventDefault();  
    } else {
        e.preventDefault();
        var formData = {
            name: nameHandle.value,
            department: departmentHandle.value,
            priority: getPriorityValue(),
            message: messageHandle.value 
        }; 
    
        axios.post(`${baseUrl}/tickets?api_key=${key}`, formData)
        .then(function(response){
            var ticket = response.data; 
            buildRow(ticket);
            countHandle.innerHTML = parseInt(countHandle.innerHTML) + 1;
            ticketFormHandle.reset(); 
            alertHandle.innerHTML = 
            `<div class="alert alert-success">
                Sucessfully Created
            </div>`; 
        })
        .catch(function(err){
            console.log(err); 
        })
    }
}, false); 



function filterTickets(priority) {
    tableBodyHandle.innerHTML = '';
    var count = 0;
    tickets.forEach(function(ticket) {
       if(ticket.priority === priority){
        buildRow(ticket,count);
        count++;
    }
    
});
countHandle.innerHTML = count;
totalHandle.innerHTML = `showing ${count} tickets of total ${tickets.length} tickets`;
}


selectHandle.addEventListener('change',function() {
    var data = selectHandle.value;
    tableBodyHandle.innerHTML = '';
   /* for(var i=0;i<tickets.length;i++){
        tableBodyHandle.innerHTML = '';
        if(data === 'All') {
            getTickets();
        }else if(tickets[i].priority === data){
            filterTickets(data);
        }
    }*/
   if(data === 'High') {
        filterTickets('High');
    } else if(data === 'Medium') {
        filterTickets('Medium');
    } else if(data === 'Low') {
        filterTickets('Low');
    } else {
        getTickets();
    }
},false);
/*
highHandle.addEventListener('change',function() {
    console.log('you clicked high button');
    filterTickets(selectHandle.value);
},false);

mediumHandle.addEventListener('change',function() {
    console.log('you clicked medium button');
    filterTickets(selectHandle.value);

},false);

lowHandle.addEventListener('change',function() {
    console.log('you clicked low button');
    filterTickets(selectHandle.value);
},false);*/

searchHandle.addEventListener('keyup',function(){
    tableBodyHandle.innerHTML = '';
    var searchResult = tickets.filter(function(ticket) {
        return ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0 || ticket.name.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 || ticket.department.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 || ticket.priority.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 || ticket.message.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0;
    });
    searchResult.forEach(function(ticket,i) {
        totalCount = i;
        buildRow(ticket,i);
    })
    countHandle.innerHTML = searchResult.length;
    totalHandle.innerHTML = `showing ${searchResult.length} tickets of total ${tickets.length} tickets`;
    
},false);

window.addEventListener('load', function(){
    // console.log('page has been loaded')
    getTickets(); 
}, false);