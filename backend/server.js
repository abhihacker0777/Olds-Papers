const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());

// GOOGLE SHEET JSON URL
const sheetURL =
"https://docs.google.com/spreadsheets/d/1Ik841hYlchYjANuAnSoegC73vZguSccn3Tyz98oVZ9U/gviz/tq?tqx=out:json";

app.get('/api/papers', async (req,res)=>{

 try{

   const response = await fetch(sheetURL);
   const text = await response.text();

   const json = JSON.parse(text.substr(47).slice(0,-2));
   const rows = json.table.rows;

   const papers = rows.map(r => ({
      course: r.c[0]?.v,
      year: r.c[1]?.v,
      specialization: r.c[2]?.v,
      sem: r.c[3]?.v,
      exam: r.c[4]?.v,
      name: r.c[5]?.v,
      link: r.c[6]?.v
   }));

   res.json(papers);

 }catch(err){

   res.status(500).json({error:"Failed to fetch sheet"});

 }

});

app.listen(3000,()=>{
 console.log("API running at http://localhost:3000/api/papers");
});
