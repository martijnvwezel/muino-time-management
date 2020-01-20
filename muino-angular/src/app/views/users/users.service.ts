import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersService {

    public total_size_users = 0; // urg


    constructor(private http: HttpClient) { }


    getUserInfo(user_id): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/admin/userinfo/' + String(user_id)).subscribe((data: any) => {
                observer.next(data.user[0]);
                observer.complete();
            })
        });
    }


    postProfileAvatar_admin(user_id, image): Observable<any> {
        // console.log("upload to server\n");
        return Observable.create(observer => {
            this.http.post('/api/admin/avatar', {
                image,
                user_id
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    getAllUsers(): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/admin/users', {
            }).subscribe((data: any) => {
                observer.next(data.users);
                this.total_size_users = data.users.length; // ! work this ? untested
                observer.complete();
            })
        });
    }


    getUserById(user_id: string): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/admin/users', {
                user_id,
            }).subscribe((data: any) => {
                observer.next(data.users);
                observer.complete();
            })
        });
    }

    remove_role(id_user: string, role: string) {
        return Observable.create(observer => {
            this.http.post('/api/admin/role_delete', {
                id_user,
                role
            }).subscribe((data: any) => {
                observer.next(data.user);
                console.log("data: ", data.user);
                observer.complete();
            });
        });
    }

    add_role(id_user: string, role: string) {
        return Observable.create(observer => {
            this.http.post('/api/admin/role_add', {
                id_user,
                role
            }).subscribe((data: any) => {
                observer.next(data.user);
                console.log("data: ", data.user);
                observer.complete();
            });
        });
    }
    setRoles(username: string, id_user: string, role: string, removeRole: boolean) {
        return Observable.create(observer => {
            this.http.post('/api/admin/role', {
                username,
                id_user,
                role,
                removeRole
            }).subscribe((data: any) => {
                observer.next(data.users);
                // console.log("users setRole: " + JSON.stringify(data.users));
                console.log("data: ", data.user);
                this.total_size_users = data.length;
                // this.setUser(data.user);//?
                observer.complete();
            });
        });
    }


    setRole(username: string, id_user: string, role: string, removeRole: boolean) {
        return Observable.create(observer => {
            this.http.post('/api/admin/role', {
                username,
                id_user,
                role,
                removeRole
            }).subscribe((data: any) => {
                observer.next(data.users);
                // console.log("users setRole: " + JSON.stringify(data.users));
                console.log("data: ", data.user);
                this.total_size_users = data.length;
                // this.setUser(data.user);//?
                observer.complete();
            });
        });
    }

    remove_user(remove_user: string) {
        return Observable.create(observer => {
            this.http.delete('/api/admin/user/'+String(remove_user)).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            });
        });


    }



    public updateUser_v2(user_id, update_user, acitvity_status): Observable<any> {


        let user = update_user;

        // * This cleans empty strings of a object
        // Object.keys(user).forEach((key) => (user[key] === "") && delete user[key]);


        user['user_id'] = user_id;

        // * remove when password is not added
        if ( !(user.password)  || !(user.repeatPassword) ) { // hack
            delete user['password'];
            delete user['repeatPassword'];
        }

        user['acitvity_status'] = acitvity_status;

        if (user.hourrate) { user['hour_rate'] = Number(user.hourrate); delete user.hourrate }

        // * add telegram info to object
        // if ((user.bot_id && user.bot_id.length > -1) || (user.api_token && user.api_token.length > -1) || (user.chat_id && user.chat_id.length > -1)) {
            user['telegram'] = {};
            if (user.bot_id) { user.telegram['bot_id'] = user.bot_id; }
            if (user.api_token) { user.telegram['api_token'] = user.api_token; }
            if (user.chat_id) { user.telegram['chat_id'] = user.chat_id; }
            // console.log("telegram added");
            
        // }
        delete user.bot_id; 
        delete user.api_token; 
        delete user.chat_id; 

        return Observable.create(observer => {
            this.http.post('/api/admin/updateusers',user).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            });
        });
    }




    // TODO this function needs an update, because this was childish
    updateUser(user_id: string,
        firstname: string,
        lastname: string,
        username: string,
        phonenumber: string,
        email: string,
        avatar_path: string,
        company_Path: string,
        company: string,
        Location_: string,
        hourrate: string,
        bot_id: string,
        api_token: string,
        chat_id: string,
        password: string,
        repeatPassword: string,
        acitvity_status: string): Observable<any> {


        let updateUserInfo = {};

        if (!user_id) {
            console.log("User id is not given");
            return;
        }

        let telegram = {};

        if (user_id) { updateUserInfo['user_id'] = user_id; }
        if (firstname && firstname.length > 0) { updateUserInfo['firstname'] = firstname; }
        if (lastname && lastname.length > 0) { updateUserInfo['lastname'] = lastname; }
        if (username && username.length > 0) { updateUserInfo['username'] = username; }
        if (phonenumber && phonenumber.length > 0) { updateUserInfo['phonenumber'] = phonenumber; }
        if (email && email.length > 0) { updateUserInfo['email'] = email; }
        if (avatar_path && avatar_path.length > 0) { updateUserInfo['avatar_path'] = avatar_path; }
        if (company_Path && company_Path.length > 0) { updateUserInfo['company_Path'] = company_Path; }
        if (company && company.length > 0) { updateUserInfo['company'] = company; }
        if (Location_ && Location_.length > 0) { updateUserInfo['location'] = Location_; }
        if (hourrate) { updateUserInfo['hour_rate'] = Number(hourrate); }
        if (bot_id && bot_id.length > 0) { telegram['bot_id'] = bot_id; }
        if (api_token && api_token.length > 0) { telegram['api_token'] = api_token; }
        if (chat_id && chat_id.length > 0) { telegram['chat_id'] = chat_id; }
        if (password && password.length > 0) { updateUserInfo['password'] = password; }
        if (repeatPassword && repeatPassword.length > 0) { updateUserInfo['repeatPassword'] = repeatPassword; }
        if (password === "" || repeatPassword === "") { // hack
            delete updateUserInfo['password'];
            delete updateUserInfo['repeatPassword'];
        }
        if (acitvity_status) { updateUserInfo['acitvity_status'] = acitvity_status; }

        if ((bot_id && bot_id.length > 0) || (api_token && api_token.length > 0) || (chat_id && chat_id.length > 0)) {
            updateUserInfo['telegram'] = telegram;
            // console.log(telegram);
        }


        return Observable.create(observer => {
            console.log(updateUserInfo);

            this.http.post('/api/admin/updateusers', {
                updateUserInfo
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            });
        });
    }

}