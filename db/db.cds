namespace my.tabelas;

using {
    managed
} from '@sap/cds/common';


entity Users:  managed {
    key id : String;
    nome: String;
    pais: String;
    idioma: Idioma default 'EN';
    salario: Integer;
    imposto: String;
}
type Idioma : String enum {
  Ingles = 'EN'; Portugues = 'PT';
}