const cds = require('@sap/cds')
const {Users} = cds.entities('my.tabelas')
const regrasUser = require('./regrasUser/regras')
module.exports = class userService extends cds.ApplicationService {
    async init(){
        this.before(['CREATE', 'UPDATE'], 'user', this.regras);
        this.on('retornaNomeUsrDia', this.getNomeUsrDia)
        await super.init();
    }

    async regras(req){
        const Regras = new regrasUser(req.data);
        console.log(req.data ,"--req .data")
        let dados = Regras.start();
        // console.log(dados ,"   dados")
        return dados;
        
    }
    async getNomeUsrDia(req){
        let nomeUsr = req.data.nome;
        console.log(nomeUsr)
        const Usr = await SELECT.one(Users). where({"nome": nomeUsr})
        return Usr.nome +' --> ' +  new Date()
    }
}