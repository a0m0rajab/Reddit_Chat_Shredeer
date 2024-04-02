const RedditLink = "https://matrix.redditspace.com/_matrix/client/v3/"

async function deleteMessages(messages, autherization, roomId, userId) {
    return new Promise(async (resolve, reject) => {
        let x = 1
        let y = 1
        console.log("Total Messages Sent ", messages.length)
        messages = messages.filter(element => {
            // console.log("filter ", userId == element.sender && element.content.body, "User ID", userId)
            if (userId == element.sender && element.content.body) {
                return true
            } else {
                return false
            }
        })
        console.log("Your messages ", messages.length)
        for await (let element of messages) {
            if (element.content.body) {
                // messageNo 
                document.getElementById('messageNo').textContent = x;
                document.getElementById('totalMessages').textContent = messages.length;
                console.log(
                    "Deleting message ",
                    element.event_id,
                    " ",
                    x,
                    " of ",
                    y,
                    " Total messages ",
                    messages.length
                )
                let result = await fetch(
                    `https://matrix.redditspace.com/_matrix/client/v3/rooms/${roomId}/redact/${encodeURIComponent(
                        element.event_id
                    )}/m1.2`,
                    {
                        method: "PUT",
                        headers: {
                            authorization: autherization || ""
                        },
                        body: JSON.stringify({})
                    }
                )
                if (result.status !== 200) {
                    console.log(
                        "Error in deleting message",
                        result.status,
                        result.statusText
                    )
                }
                // console.log("Result server ", result);
                let data = await result.json()
                console.log(
                    "Message Deleted: ",
                    element.event_id,
                    " ",
                    x++,
                    " of ",
                    y++,
                    " Total messages ",
                    messages.length
                )
            }
        }
        resolve(messages.length + " Messages Deleted Successfully")
    })
}

async function getRoomMessages(roomId, autherization, from, userId) {
    return new Promise(async (resolve, reject) => {
        // console.log("Auth" , autherization);
        let numberOfPages = 0
        let result = []
        let [start, end] = ["", ""]
        // console.log("headers", from, roomId)
        do {
            let url = `https://matrix.redditspace.com/_matrix/client/v3/rooms/${roomId}/messages?limit=1000&dir=b&from=${end}`
            // console.log("url",url);
            let response = await fetch(url, {
                headers: {
                    authorization: autherization || ""
                }
            })
            let data = await response.json()
            if (data.error) {
                let error = new Error(data.error)
                reject(error)
                throw error
            }

            if (data.chunk) {
                result.push(...data.chunk)
            }
            end = data.end
            // console.log("Getting page ", numberOfPages, data);
            if (end === "t0_0") {
                console.log("End of messages, total pages ", numberOfPages)
                console.log("Messages", result.length)
                resolve(result)
            }
        } while (end !== "t0_0")
    })
}

async function getUserId(token) {
    let x = await fetch(RedditLink + `account/whoami`, {
        headers: {
            authorization: token
        }
    })
    let y = await x.json()
    return y.user_id
}

async function getFilter(autherization, user_id) {
    // console.log("Authorization Get Filter ", autherization)
    user_id = decodeURIComponent(user_id);
    const myHeaders = new Headers()
    myHeaders.append("authorization", autherization || "")
    const raw = JSON.stringify({
        room: {
            state: {
                lazy_load_members: true
            }
        }
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    }

    let responce = await fetch(
        RedditLink + `user/${user_id}/filter`,
        requestOptions
    )
    let data = await responce.json()
    console.log("Get Filter ", data)
    return data.filter_id
}

async function getAllRooms(authorization) {
    let next_batch = ""
    let result = []
    let user_id = await getUserId(authorization)
    let filter = await getFilter(authorization, user_id)
    const requestOptions = {
        method: "GET",
        headers: {
            authorization: authorization || ""
        },
        redirect: "follow"
    }

    do {
        let url =
            RedditLink + `sync?filter=${filter}&full_state=true&since=` + next_batch
        let responce = await fetch(url, requestOptions)
        let data = await responce.json()
        result.push(...Object.keys(data.rooms?.join || {}))
        next_batch = data.next_batch
        // console.log("Next Batch", next_batch)
    } while (!!next_batch)

    return result
}


async function removeThisRoom() {
    document.getElementById('done').style.visibility = 'hidden';
    let stats = document.getElementById('stats');
    stats.style.visibility = 'visible';
    let roomId = window.location.pathname.split("/")[2];
    let autherization = "bearer " + JSON.parse(document.querySelector("[token]").getAttribute("token")).token
    let userId = await getUserId(autherization)
    let messages = await getRoomMessages(roomId, autherization, roomId, userId);
    let result = await deleteMessages(messages, autherization, roomId, userId);
    document.getElementById('done').style.visibility = 'visible';
    return result;
}

async function deleteAll() {
    document.getElementById('done').style.visibility = 'hidden';
    let stats = document.getElementById('stats');
    stats.style.visibility = 'visible';
    let getSpan = document.querySelectorAll('span.rooms');
    getSpan.forEach(element => {
        element.style.visibility = 'visible';
    });
    const authHeader = "bearer " + JSON.parse(document.querySelector("[token]").getAttribute("token")).token;
    let userId = await getUserId(authHeader);
    let allRooms = await getAllRooms(authHeader);
    // set total rooms
    document.getElementById('totalRooms').textContent = allRooms.length;
    let counter = 1;
    for await (let roomId of allRooms) {
        // set room number
        document.getElementById('roomNo').textContent = counter;
        console.log(`Deleting messages from ${counter++} of ${allRooms.length} rooms`);
        let messages = await getRoomMessages(roomId, authHeader, roomId, userId);
        let result = await deleteMessages(messages, authHeader, roomId, userId);
        console.log("Result ", result);
        console.log(`Messages deleted from ${counter++} of ${allRooms.length} rooms`);
    }
    console.log(allRooms);
    getSpan.forEach(element => {
        element.style.visibility = 'hidden';
    });
    document.getElementById('done').style.visibility = 'visible';
}

// Create main div
let mainDiv = document.createElement('div');
mainDiv.style.display = 'flex';
mainDiv.style.flexDirection = 'row';
mainDiv.style.justifyContent = 'space-around';
mainDiv.style.height = '10dvh';
mainDiv.style.alignItems = 'center';
mainDiv.style.backgroundColor = 'azure';

// Create span
let span = document.createElement('span');
span.textContent = 'Reddit Chat Shredder';
span.style.fontSize = 'large';
span.style.color = 'red';
mainDiv.appendChild(span);

// Create buttons
let button1 = document.createElement('button');
button1.textContent = 'Delete This Room Messages';
// add padding right and left by 10px
button1.style.padding = '10px';
button1.style.display = 'flex';
button1.style.alignItems = 'center';
button1.onclick = removeThisRoom;
mainDiv.appendChild(button1);


let button2 = document.createElement('button');
button2.textContent = 'Delete All Messages';
button2.style.padding = '10px';
button2.style.display = 'flex';
button2.style.alignItems = 'center';
button2.onclick = deleteAll;
mainDiv.appendChild(button2);

// Create another span
let span2 = document.createElement('span');
span2.id = 'stats';
span2.innerHTML = `     <span class="rooms" style="visibility: hidden;">
                            total rooms: 
                            <span id=totalRooms>Loading..</span>
                        </span> 
                        <br> 
                        deleting message 
                        <span id=messageNo>Loading..</span> 
                        of 
                        <span id=totalMessages>Loading..</span>
                        <span class="rooms" style="visibility: hidden;">
                            from room 
                            <span id=roomNo>Loading..</span>
                        </span>
                        <br>
                        <span id="done" style="visibility: hidden;">
                        Messages Deleted Successfully
                        </span>
                        `;

span2.style.visibility = 'hidden';
mainDiv.appendChild(span2);

// Get the faceplate-app element
let faceplateApp = document.querySelector('faceplate-app');

// Insert mainDiv as the first child
if (faceplateApp.firstChild) {
    faceplateApp.insertBefore(mainDiv, faceplateApp.firstChild);
} else {
    faceplateApp.appendChild(mainDiv);
}

// add height 90dvh to rs-app
let rsApp = document.querySelector('rs-app');
rsApp.style.height = '90dvh';