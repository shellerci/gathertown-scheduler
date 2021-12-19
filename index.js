addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
 if (request.headers.get('x-schedule-key') != SCHEDULER_API_KEY){
   return new Response('NOPE', {status: 401})
 }

 if (request.method == "POST"){
   scheduler = new StandupScheduler()
   return await scheduler.handlePost(request)
 }
}

class StandupScheduler{
 gatherParams= {apiKey: GATHER_API_KEY, mapId: GATHER_MAP_ID, spaceId: GATHER_SPACE_ID}

 async handlePost(request){
   const newId = await request.text()
   const space = await this.getSpace()
   let updatedSpace = this.updateMeetingLink(space, newId)
   const updatedResponse = await this.saveMap(updatedSpace)
   return new Response(updatedResponse.body, {headers: {"content-type": "text/plain"}})
 }

 async saveMap(updatedSpace){
   let requestBody = Object.assign(this.gatherParams, {"mapContent" : updatedSpace})
   const init = {body: JSON.stringify(requestBody), method: "POST", headers: {"content-type": "application/json;charset=UTF-8"}}
   return await fetch(GATHER_PUT_ENDPOINT, init)
 }
 
 updateMeetingLink(space, meeting_id){
   for( let o of space.objects){
     if (o._name == HANGOUT_KEY){
       o.properties.zoomLink = "http://meet.google.com/" + meeting_id
     }
   }
   return space
 }
 
 async getSpace(){
   const data = await fetch(GATHER_GET_ENDPOINT + "?" +  new URLSearchParams(this.gatherParams))
   return await data.json()  
 }
}
