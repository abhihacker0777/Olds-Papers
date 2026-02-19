const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Ik841hYlchYjANuAnSoegC73vZguSccn3Tyz98oVZ9U/gviz/tq?tqx=out:json";

let cachedData = null;
let lastFetch = 0;

// cache time (5 minutes)
const CACHE_TIME = 5 * 60 * 1000;

app.get('/api/papers', async (req,res)=>{

 try{

   // ✅ USE CACHE IF NOT EXPIRED
   if(cachedData && (Date.now() - lastFetch < CACHE_TIME)){
      return res.json(cachedData);
   }

   // fetch from sheet
   const response = await fetch(SHEET_URL);
   const text = await response.text();

   const json = JSON.parse(text.substr(47).slice(0,-2));

   const rows = json.table.rows;

   cachedData = rows.map(r=>({
      course:r.c[0]?.v,
      year:r.c[1]?.v,
      specialization:r.c[2]?.v,
      sem:r.c[3]?.v,
      exam:r.c[4]?.v,
      name:r.c[5]?.v,
      link:r.c[6]?.v
   }));

   lastFetch = Date.now();

   res.json(cachedData);

 }catch(e){

   res.status(500).json({error:"failed"});
 }

});

app.listen(process.env.PORT || 3000);
