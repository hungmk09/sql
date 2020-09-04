const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// tao may chu
app.listen(PORT,function () {
    console.log("server is running...");
})

app.use(express.static("public"));
app.set("view engine","ejs");

// tao cau hinh ket noi Sql server
const mssql = require("mssql");
const config = {
    server: '101.99.13.2',
    user:'sa',
    password:'z@GH7ytQ',
    database:'test'
}
// connect db
mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("ket noi DB thanh cong!");
})
// tao doi tuong truy van
const db = new mssql.Request();

app.get("/",function (req,res) {
    let sql_text = "SELECT * FROM DanhMuc;SELECT * FROM ThuongHieu;SELECT TOP 12 * FROM SanPham ORDER BY ID DESC;"
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        else res.render("home",{
            danhmucs: rows.recordsets[0],
            thuonghieus: rows.recordsets[1],
            sanphams: rows.recordsets[2],
        });
    })
    // res.render("home");
})

app.get("/danh-muc/:id",async function (req,res) {
    const DanhMucID = req.params.id;
    const sql_text = "SELECT * FROM DanhMuc;SELECT * FROM ThuongHieu; " +
        "SELECT * FROM SanPham WHERE DanhMucID = "+DanhMucID;
    let data = {
        danhmucs: [],
        thuonghieus: [],
        sanphams: [],
        danhMucHienTai: {}
    }
    await db.query(sql_text).then(rows=>{
        const danhmucs = rows.recordsets[0];
        for(let d of danhmucs){
            if(d.ID == DanhMucID){
                data.danhMucHienTai = d;
                break;
            }
        }
        data.danhmucs = danhmucs;
        data.thuonghieus = rows.recordsets[1];
        data.sanphams =  rows.recordsets[2];
    }).catch(err=>{

    })
    res.render("danhmuc",data);
})

