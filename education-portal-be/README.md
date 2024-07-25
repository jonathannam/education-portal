## How to start project
1. Go to file development.env edit username and password to connect your local database
2. Go to MySQL, create new DB name education-portal.
3. `npm install` to install all dependencies
4. At the first time running, we need create admin user manual:
- Go to user.controller.ts, then comment code line 56,57.
```
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SystemAdmin)
```
- Then run `npm start`, go to `localhost:3000/swagger` and create new admin user by using endpoint `post api/users`
- Note: new user role must be "System Admin"
5. After generating admin user, you can start using application normally
