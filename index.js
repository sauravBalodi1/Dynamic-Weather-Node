const http=require('http')
const fs=require('fs')
var requests=require('requests')
const homeFile=fs.readFileSync("home.html",'utf-8')

const replaceVal=(tempVal,orgVal)=>{
 let temperature=tempVal.replace("{%tempval%}",Math.round((orgVal.main.temp-273)))
 temperature=temperature.replace("{%tempmin%}",Math.round((orgVal.main.temp_min-273)))
 temperature=temperature.replace("{%tempmax%}",Math.round((orgVal.main.temp_max-273)))
 temperature=temperature.replace("{%location%}",orgVal.name)
 temperature=temperature.replace("{%country%}",orgVal.sys.country)
 temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main)
return temperature;
}
const server=http.createServer((req,rep)=>{
    if(req.url=='/')
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Chandigarh&appid=aec5abe2f2aceaa45e358a7b1aa1f561")
        .on('data',(chunk)=>{
            const objdata=JSON.parse(chunk)//converting json to object
            const arrayObj=[objdata]
      // console.log(arrayObj[0].main.temp-273)
         const realTimeData=arrayObj.map((val)=> replaceVal(homeFile,val)).join("");
       
        rep.write(realTimeData)
        })
        .on('end',(err)=>{
            if(err)return console.log("cnnection is lost")

           rep.end()
        })
    }
})
server.listen(3000,"127.0.0.1")
