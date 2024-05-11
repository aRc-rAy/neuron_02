const express=require('express');
const app=express();
const fs=express('fs')
const exceltoJson=require('convert-excel-to-json');
const cors=require('cors')

app.use(cors())

const result=exceltoJson({
    sourceFile:'./port_geo_location.xlsx',
    columnToKey: {
        A: 'portname',
        B: 'latitude',
        C:'longitude'
    }
})

console.log(result);

app.get('/portdata',(req,res)=>{

    res.status(200).json(
        result
    )
})



app.listen(4000,()=>{
    console.log('gfdgfgf');
})

