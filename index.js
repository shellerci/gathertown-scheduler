const form = `<html><body><div style="margin-top:100px;"><form action="/" method="POST"><input type="text" name="new-id"/><button type="submit" value="Set Meeting ID">Set Meeting ID</button></form></div></body></html>`
const success = `<html><head><body><div style="margin-top:100px;"><h1>ID Updated</h1></div></body></html>`
const gatherParams= {key: GATHER_API_KEY, map: GATHER_MAP_ID, space: GATHER_SPACE_ID}
const htmlHeaders = {"content-type": "text/html;charset=UTF-8"}
const jsonHeaders = {"content-type": "application/json;charset=UTF-8"}

addEventListener("fetch", event => {
   event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method == "GET"){
    return new Response(form, {headers: htmlHeaders})
  }
  if (request.method == "POST"){
    const new_id = await request.text()
    const space = await fetch(`${GATHER_GET_ENDPOINT}?${gatherParams.join('&')}` )
    const data = await space.json()
    for( let o of data.objects){
      if (o.previewMessage == HANGOUT_KEY){
        const newId = await MEETINGS.get(HANGOUT_KEY)
        o.properties.zoomLink = "http://meet.google.com/" + new_id.split("=")[1]
      }
    }
    let modified = {"apiKey" : apiKey,"mapId" : mapId,"spaceId" : spaceId,"mapContent" : data}
    const init = {body: JSON.stringify(modified), method: "POST", headers: jsonHeaders}
    const response = await fetch(GATHER_PUT_ENDPOINT, init)
    return new Response(success, {headers: {"content-type": "text/html;charset=UTF-8",},})
  }
}