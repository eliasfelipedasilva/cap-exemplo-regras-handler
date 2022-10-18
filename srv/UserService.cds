using {my.tabelas as db} from '../db/db';


service UserService {
    entity user as projection on db.Users ;
    action retornaNomeUsrDia (nome: String) returns String;
}