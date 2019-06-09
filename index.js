const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const option = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'mysql',
    connectTimeout: 5000,
    multipleStatements: false
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(8889, ()=>{console.log('启动服务!!!!!!!')});

// const conn = mysql.createConnection(option);
let pool;
repool()
// 使用断线重连机制


// 案件
app.all('/caseSelect', (req,res)=>{
    pool.query('SELECT mxw_case.id,mxw_case.isPre,mxw_case.des,mxw_case.time,mxw_case.address,mxw_pteam.name pteamName,mxw_tteam.name tteamName,mxw_case.state FROM mxw_case,mxw_tteam,mxw_pteam WHERE mxw_case.pteamId=mxw_pteam.id&&mxw_case.tteamId=mxw_tteam.id ORDER BY mxw_case.id', (e,r)=>{
        res.json(new Result({data:r}))
    })
})

app.post('/addCase', (req,res)=>{
    pool.query("insert into mxw_case (des,isPre,time,address,state,pteamId,tteamId) values ('"+ req.body.des +"','1','"+ req.body.time +"','"+ req.body.address +"','"+ req.body.radio +"','"+ req.body.pteamId +"','"+ req.body.tteamId +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updateCase', (req,res)=>{
    pool.query("update mxw_case set des='"+ req.body.des +"',time='"+ req.body.time +"',address='"+ req.body.address +"',state='"+ req.body.radio +"',pteamId='"+ req.body.pteamId +"',tteamId='1' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deleteCase', (req,res)=>{
    pool.query("delete from mxw_case where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})


// 反恐装备
app.all('/pgoodsSelect', (req,res)=>{
    pool.query('select mxw_pgoods.name goodName,mxw_pgoods.id,mxw_pteam.name pteamName from mxw_pgoods,mxw_pteam where mxw_pteam.id=mxw_pgoods.pteamId;', (e,r)=>{
        res.json(new Result({data:r}))
    })
})
app.post('/addPgoods', (req,res)=>{
    pool.query("insert into mxw_pgoods (name,pteamId) values ('"+ req.body.name +"','"+ req.body.pteamId +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updatePgoods', (req,res)=>{
    pool.query("update mxw_pgoods set name='"+ req.body.name +"',pteamId='"+ req.body.pteamId +"' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deletePgoods', (req,res)=>{
    pool.query("delete from mxw_pgoods where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})

// 反恐人员
app.all('/ppersonSelect', (req,res)=>{
    pool.query('SELECT mxw_pperson.id,mxw_pperson.name,mxw_pperson.age,mxw_pperson.sex,mxw_pteam.name pteamName,mxw_pperson.state FROM mxw_pperson,mxw_pteam WHERE mxw_pperson.pteamId = mxw_pteam.id', (e,r)=>{
        res.json(new Result({data:r}))
    })
})

app.post('/addPperson', (req,res)=>{
    pool.query("insert into mxw_pperson (name,age,sex,state,pteamId) values ('"+ req.body.name +"','"+ req.body.age +"','"+ req.body.sex +"','"+ req.body.state +"','"+ req.body.pteamId +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updatePperson', (req,res)=>{
    pool.query("update mxw_pperson set name='"+ req.body.name +"',age='"+ req.body.age +"',sex='"+ req.body.sex +"',state='"+ req.body.state +"',pteamId='"+ req.body.pteamId +"' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deletePperson', (req,res)=>{
    pool.query("delete from mxw_pperson where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})

// 反恐队伍
app.all('/pteamSelect', (req,res)=>{
    pool.query('SELECT mxw_pteam.id,mxw_pteam.name,mxw_pperson. NAME ppersonName,mxw_case.des,mxw_pgoods. NAME pgoodsName FROM mxw_pteam,mxw_pperson,mxw_case,	mxw_pgoods WHERE	mxw_pperson.pteamId = mxw_pteam.id && mxw_case.id = mxw_pteam.caseId && mxw_pgoods.pteamId = mxw_pteam.id', (e,r)=>{
        let reset = []
        let array = []
        r.forEach(i =>{
            if (reset[i.id]) {
                reset[i.id].ppersonName.push(i.ppersonName+'; ')
                reset[i.id].des.push(i.des+'; ')
                reset[i.id].pgoodsName.push(i.pgoodsName+'; ')
            } else {
                reset[i.id] = {
                    id:i.id,
                    name:i.name,
                    ppersonName:[],
                    des:[],
                    pgoodsName:[]
                }
                reset[i.id].ppersonName.push(i.ppersonName+'; ')
                reset[i.id].des.push(i.des+'; ')
                reset[i.id].pgoodsName.push(i.pgoodsName+'; ')
            }
        })
        reset.forEach(j => {
            if (j) {
                j.ppersonName = [...new Set(j.ppersonName)]
                j.des = [...new Set(j.des)]
                j.pgoodsName = [...new Set(j.pgoodsName)]
                array.push(j)
            } else {

            }
        })
        res.json(new Result({data:array}))
    })
})
// 危险品
app.all('/tgoodsSelect', (req,res)=>{
    pool.query('select mxw_company.name,mxw_tgoods.name goodName,mxw_tgoods.id,mxw_tteam.name tteamName from mxw_company,mxw_tgoods,mxw_tteam where mxw_company.id=mxw_tgoods.company&&mxw_tteam.id=mxw_tgoods.tteamId;', (e,r)=>{
        res.json(new Result({data:r}))
    })
})

app.post('/addTgoods', (req,res)=>{
    pool.query("insert into mxw_tgoods (name,company,tteamId) values ('"+ req.body.name +"','"+ req.body.company +"','"+ req.body.tteamId +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updateTgoods', (req,res)=>{
    pool.query("update mxw_tgoods set name='"+ req.body.name +"',company='"+ req.body.company +"',tteamId='"+ req.body.tteamId +"' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deleteTgoods', (req,res)=>{
    pool.query("delete from mxw_tgoods where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})


// 涉恐人员
app.all('/tpersonSelect', (req,res)=>{
    pool.query('SELECT mxw_tperson.id,mxw_tperson.name,mxw_tperson.age,mxw_tperson.sex,mxw_tteam.name tteamName,mxw_tperson.state FROM mxw_tperson,mxw_tteam WHERE mxw_tperson.tteamId = mxw_tteam.id', (e,r)=>{
        res.json(new Result({data:r}))
    })
})

app.post('/addTperson', (req,res)=>{
    pool.query("insert into mxw_tperson (name,age,sex,state,tteamId) values ('"+ req.body.name +"','"+ req.body.age +"','"+ req.body.sex +"','"+ req.body.state +"','"+ req.body.tteamId +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updateTperson', (req,res)=>{
    pool.query("update mxw_tperson set name='"+ req.body.name +"',age='"+ req.body.age +"',sex='"+ req.body.sex +"',state='"+ req.body.state +"',tteamId='"+ req.body.tteamId +"' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deleteTperson', (req,res)=>{
    pool.query("delete from mxw_tperson where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})
// 恐怖组织
app.all('/tteamSelect', (req,res)=>{
    pool.query('SELECT mxw_tteam.id,mxw_tteam.name,mxw_tperson. NAME tpersonName,mxw_case.des,mxw_tgoods. NAME tgoodsName FROM mxw_tteam,mxw_tperson,mxw_case,	mxw_tgoods WHERE	mxw_tperson.tteamId = mxw_tteam.id && mxw_case.id = mxw_tteam.caseId && mxw_tgoods.tteamId = mxw_tteam.id', (e,r)=>{
        let reset = []
        let array = []
        r.forEach(i =>{
            if (reset[i.id]) {
                reset[i.id].tpersonName.push(i.tpersonName+'; ')
                reset[i.id].des.push(i.des+'; ')
                reset[i.id].tgoodsName.push(i.tgoodsName+'; ')
            } else {
                reset[i.id] = {
                    id:i.id,
                    name:i.name,
                    tpersonName:[],
                    des:[],
                    tgoodsName:[]
                }
                reset[i.id].tpersonName.push(i.tpersonName+'; ')
                reset[i.id].des.push(i.des+'; ')
                reset[i.id].tgoodsName.push(i.tgoodsName+'; ')
            }
        })
        reset.forEach(j => {
            if (j) {
                j.tpersonName = [...new Set(j.tpersonName)]
                j.des = [...new Set(j.des)]
                j.tgoodsName = [...new Set(j.tgoodsName)]
                array.push(j)
            } else {

            }
        })
        res.json(new Result({data:array}))
    })
})

// 危险品经销商
// app.all('/companySelect', (req,res)=>{
//     pool.query('select mxw_company.name,mxw_tgoods.name goodName,mxw_company.id from mxw_company left JOIN mxw_tgoods on mxw_company.id=mxw_tgoods.company', (e,r)=>{
//             let array = []
//             let reset =  []
//             r.forEach(i=> {
//                 reset.forEach(j=>{
//                     if (i.id == j) {

//                     } else {
//                         reset.push(i.id)
//                         array.push()
//                     }
//                 })
//             })
//             res.json(new Result({data:array}))
//         })
// })
app.all('/companySelect', (req,res)=>{
    pool.query('select mxw_company.name,mxw_tgoods.name goodName,mxw_company.id from mxw_company left JOIN mxw_tgoods on mxw_company.id=mxw_tgoods.company', (e,r)=>{
        let reset = []
        let array = []
        r.forEach(i =>{
            //console.log('aaa',i)
            if (reset[i.id]) {
                reset[i.id].goodName+=i.goodName+'; '
            } else {
                reset[i.id] = {
                    id:i.id,
                    name:i.name,
                    goodName:''
                }
                reset[i.id].goodName+=i.goodName+'; '
            }
        })
        reset.forEach(j => {
            if (j) {
                array.push(j)
            } else {

            }
        })
        res.json(new Result({data:array}))
    })
})

app.post('/addCompany', (req,res)=>{
    pool.query("insert into mxw_company (name) values ('"+ req.body.name +"');", (e,r)=>{
        res.json({isSuccess: true, message: '提交成功'})
    })
})

app.post('/updateCompany', (req,res)=>{
    pool.query("update mxw_company set name='"+ req.body.name +"' where id='"+ req.body.updateId +"';", (e,r)=>{
        res.json({isSuccess: true, message: '修改成功'})
    })
})

app.post('/deleteCompany', (req,res)=>{
    pool.query("delete from mxw_company where id='"+ req.body.id +"';", (e,r)=>{
        res.json({isSuccess: true, message: '删除成功'})
    })
})





app.get('/test', (req,res)=>{
    res.json('mxw')
})





function Result({code=1,msg='',data={}}) {
    this.code = code;
    this.msg = msg;
    this.data = data;
}

function repool() {
    pool = mysql.createConnection({
        ...option,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0
    });
    pool.on('error',error=>error.code ==='PROTOCOL_CONNECTION_LOST' && setTimeout(reconn,2000))
}
