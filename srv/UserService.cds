using {my.tabelas as db} from '../db/db';


service UserService {
    entity user as projection on db.Users ;
    action retornaNomeUsrDia (id: String) returns String;
}