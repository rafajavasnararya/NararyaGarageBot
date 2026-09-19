export async function api(path,options={}){
  const response=await fetch("/api/"+path.replace(/^\//,""),{headers:{"content-type":"application/json"},...options});
  if(!response.ok)throw new Error("API error "+response.status);
  return response.json();
}
export const health=()=>api("health");
export const brands=()=>api("brands");
export const version=()=>api("version");