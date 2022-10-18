const cds = require("@sap/cds");

class RegrasUser {
  constructor(data) {
    this.data = data;
  }
  async start() {
    try {
      let dados = await this.setarIdioma();
      dados = await this.calculaImposto();

      return dados;
    } catch (error) {
      console.log(error)
    }
  }
  async setarIdioma() {
    let mapaIdioma = {
      Brasil: "PT",
      USA: "EN",
    };
    this.data.idioma = mapaIdioma[this.data.pais];
    console.log(this.data, "data");
  }
  async calculaImposto() {
    let mapaImposto = {
      0: "0%",
      3000: "20%",
      5000: "207%",
    };
    Object.keys(mapaImposto).map((item) => {
      let valorChave = parseInt(item);
      if (parseInt(this.data.salario) >= valorChave) {
        console.log(item, "  ", mapaImposto[item], this.data.salario);
        this.data.imposto = mapaImposto[item];
      }
    });
  }
}

module.exports = RegrasUser;
