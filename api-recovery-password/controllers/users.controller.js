const User = require('../models/users');
const bcrypt = require('bcryptjs');
const sendMail = require('../providers/mailProviders');
const jwt = require('jsonwebtoken');
const {userCreateMailTemplate} = require('../template/userCreateMail');
const crypto = require('crypto');

exports.findAll = async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email'],
        order:[['name', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`
        })
    })


};

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    await User.create(dados)
    .then( ()=>{
         /* enviar e-mail */
         let to = email;
         let cc = '';
         let subject = 'Sua conta foi criada com sucesso!'
         let mailBody = userCreateMailTemplate({
             name: dados.name,
             email: dados.email,
         })
         sendMail(to, cc, subject, mailBody);
        return res.json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
};

exports.update = async (req, res) => {
    const { id } = req.body;
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
};

exports.login = async (req, res) => {

    await sleep(3000);
    function sleep(ms){
        return new Promise( (resolve) => {
            setTimeout(resolve,ms)
        })
    }

    const user = await User.findOne({
        attributes: ['id', 'name', 'email',  'password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email ou senha incorreta!!"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 600 // 10min
        // expiresIn: 60 // 1min
    });

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
    
    // const user = await User.findOne({
        //     attributes: ['id', 'name', 'email', 'gender', 'password'],
        //     where: {
        //         email: req.body.email
        //     }
        // })
        // if(user === null){
        //     return res.status(400).json({
        //         erro: true,
        //         mensagem:"Erro: Email ou senha incorreta!!!"
        //     })
        // }
        // if(!(await bcrypt.compare(req.body.password, user.password))){
        //     return res.status(400).json({
        //         erro: true,
        //         mensagem: "Erro: Email ou senha incorreta!!!"
        //     })
        // }
        // return res.json({
        //     erro:false,
        //     mensagem: "Login realizado com sucesso!!!",
        //     name: user.name,
        //     email: user.email,
        //     gender: user.gender
        // })
};

exports.password = async (req, res) => {
    const {id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
     }
        await User.update({password: senhaCrypt }, {where: {id: id}})
        .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha edita com sucesso!"
        }); 
        }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}... A senha não foi alterada!!!`
        })
        })
};

exports.validatoken = async(req, res) => {

    await sleep(3000);
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    await User.findByPk(req.userId, { 
        attributes: ['id','name','email']
    }).then( (user) => {
        return res.status(200).json({
            erro: false,
            user
        })
    }).catch( () => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar o login!"
        })
    })
};




exports.recovery = async(req, res) =>{
    const{email}= req.body
    try{
        const user = await User.findOne({
               attributes: ['id', 'name', 'email'],
        where: {
            email: req.body.email
        } 
    }) 
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email  incorreto!!"
        }) }
     
         const token = crypto.randomBytes(6).toString('hex')
        await User.update({passwordtoken:token},{where: {email: email}})
        .then(()=>{
        let to = email;
        let cc = '';
        let subject = 'Sua conta foi criada com sucesso!'
        let mailBody = userCreateMailTemplate({
            email: email,
            token: token
        })
        sendMail(to, cc, subject, mailBody);
       return res.json({
           erro: false,
           mensagem: 'Seu codigo foi enviado com sucesso!'
       });
   }).catch( (err)=>{
       return res.status(400).json({
           erro:true,
           mensagem: `Erro: codigo nao enviado... ${err}`
       })
   }) } catch(error) {
    console.log(error)
    res.status(400).json({
        erro:true,
        mensagem:"Erro: nao foi possivel enviar o codigo de verificação, tente de novo "
    })
   }
}

exports.alterpassword = async(req, res) =>{
    const {password}= req.body
    var senhaCrypt = await bcrypt.hash(password, 8);
        const user = await User.findOne({
             attributes: ['id','email','password'],
             where: {
             email: req.body.email,
             } 
            }) 

            const valida = await User.findOne({
                attributes: ["passwordtoken"],
                where: {
                    passwordtoken: req.body.passwordtoken
                } 
               }) 
               

             if(user === null){
                return res.status(400).json({
                 erro: true,
                mensagem:"Erro: Email  incorreto!!"
                 }) }
                 if(valida === null){
                    return res.status(400).json({
                     erro: true,
                    mensagem:"Erro:codigo de verificação incorreto!!"
                     }) }
                     await User.update({password:senhaCrypt }, {where: {id: user.id}})
                     .then(() => {
                     return res.json({
                         erro: false,
                         mensagem: "Senha edita com sucesso!"
                     }); 
                     }).catch( (err) => {
                     return res.status(400).json({
                         erro: true,
                         mensagem: `Erro: ${err}... A senha não foi alterada!!!`
                     })
                     })  
}
























exports.login = async (req, res) => {

    const user = await User.findOne({
        attributes: ['id', 'name', 'email',  'password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email ou senha incorreta!!"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 600 // 10min
        // expiresIn: 60 // 1min
    });

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
    
};